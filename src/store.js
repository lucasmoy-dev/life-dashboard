import { fetchAllPrices } from './services/PriceService.js';
import { SecurityService } from './services/SecurityService.js';
import { AuthService } from './services/AuthService.js';
import { DriveService } from './services/DriveService.js';
import { ns } from './utils/notifications.js';

const STORAGE_KEY = 'life-dashboard/data'; // Legacy/Migration
const ENCRYPTED_KEY = 'life-dashboard/secured';

const defaultState = {
    // Assets that generate passive income
    passiveAssets: [],
    // Regular income sources (salary, freelance, etc.)
    activeIncomes: [],
    // Living expenses (rent, utilities, etc.)
    livingExpenses: [],
    // Other expenses
    otherExpenses: [],
    // Investment assets (stocks, crypto, etc.)
    investmentAssets: [],
    // Liabilities (debts, loans, mortgages)
    liabilities: [],
    // Currency settings
    currency: 'EUR',
    currencySymbol: '€',
    // Conversion rates to EUR
    rates: {
        EUR: 1,
        USD: 0.92,
        BTC: 37000,
        ETH: 2100,
        XRP: 0.45,
        GOLD: 1900,
        SP500: 4500,
        CHF: 1.05,
        GBP: 1.15,
        AUD: 0.60,
        ARS: 0.001,
        RNDR: 4.5
    },
    hideRealEstate: false,
    // Health Data
    health: {
        weightLogs: [],
        weightGoal: 70,
        fatLogs: [],
        fatGoal: 15,
        exerciseLogs: [],
        routines: [
            { id: '1', name: 'Día 1: Empuje', exercises: [{ name: 'Press Banca', weight: 60, reps: 14, sets: 4 }, { name: 'Press Militar', weight: 40, reps: 14, sets: 4 }] },
            { id: '2', name: 'Día 2: Tirón', exercises: [{ name: 'Dominadas', weight: 0, reps: 14, sets: 4 }, { name: 'Remo con Barra', weight: 50, reps: 14, sets: 4 }] }
        ],
        calorieLogs: []
    },
    // Goals/Tasks
    goals: [
        { id: '1', title: 'Ejemplo de Meta Diaria', timeframe: 'day', completed: false, category: 'Personal' }
    ],
    // Agenda/Events
    events: [],
    // Last fetched market data
    lastMarketData: []
};

class Store {
    constructor() {
        this.state = this.loadState();
        this.listeners = new Set();

        // Initial price fetch
        this.refreshRates();
        // Refresh every 5 minutes
        setInterval(() => this.refreshRates(), 5 * 60 * 1000);
    }

    loadState() {
        // We only load state in two phases:
        // 1. Static load of defaults (constructor)
        // 2. Real load from encrypted storage (after Auth)
        return { ...defaultState };
    }

    /**
     * Re-hydrates the state from encrypted storage after authentication
     * Also handles migration from unencrypted storage
     */
    async loadEncrypted(vaultKey) {
        const encrypted = localStorage.getItem(ENCRYPTED_KEY);
        const unencrypted = localStorage.getItem(STORAGE_KEY);

        if (encrypted) {
            try {
                const data = JSON.parse(encrypted);
                const decryptedState = await SecurityService.decrypt(data, vaultKey);
                this.state = { ...defaultState, ...decryptedState };
                this.notify();
                return true;
            } catch (e) {
                console.error('Failed to decrypt state:', e);
                return false;
            }
        } else if (unencrypted) {
            // MIGRATION: Validated we have a key, so we take plain data, 
            // encrypt it, save it to the new key, and destroy the old one.
            try {
                const parsed = JSON.parse(unencrypted);
                this.state = { ...defaultState, ...parsed };

                // Save it encrypted immediately
                await this.saveState();

                // Clean up the security leak
                localStorage.removeItem(STORAGE_KEY);
                console.log('Migration to encrypted storage successful');
                this.notify();
                return true;
            } catch (e) {
                console.error('Migration failed:', e);
                return false;
            }
        }
        return false;
    }


    async refreshRates() {
        const rates = await fetchAllPrices();
        this.setState({
            rates: { ...this.state.rates, ...rates },
            lastRatesUpdate: Date.now()
        });
    }

    async saveState() {
        try {
            const vaultKey = AuthService.getVaultKey();
            if (vaultKey) {
                const encrypted = await SecurityService.encrypt(this.state, vaultKey);
                localStorage.setItem(ENCRYPTED_KEY, JSON.stringify(encrypted));
                // Ensure plain text key is always gone if we are in encrypted mode
                localStorage.removeItem(STORAGE_KEY);
            } else {
                // If no key is present, we DON'T save to STORAGE_KEY anymore.
                // This prevents "leaking" data in plain text while logged out.
                console.warn('[Store] Attempted to save without Vault Key. Save skipped.');
            }
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    }


    getState() {
        return this.state;
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.saveState().then(() => {
            // Background Auto-sync
            const vaultKey = AuthService.getVaultKey();
            if (vaultKey && DriveService.hasToken()) {
                // Filter out non-syncable UI state
                const { hideRealEstate, ...syncData } = this.state;
                DriveService.pushData(syncData, vaultKey).then(() => {
                    console.log('[Auto-Sync] Success');
                    ns.toast('Sincronizado con Drive', 'success', 2000);
                }).catch(e => {
                    console.warn('[Auto-Sync] Failed:', e);
                });
            }
        });
        this.notify();
    }


    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    toggleRealEstate() {
        this.setState({ hideRealEstate: !this.state.hideRealEstate });
    }

    setCurrency(currency) {
        const symbols = {
            EUR: '€', USD: '$', CHF: 'Fr',
            GBP: '£', AUD: 'A$', ARS: '$', BTC: '₿'
        };
        this.setState({
            currency: currency,
            currencySymbol: symbols[currency] || '$'
        });
    }

    // Helper to convert ANY value to EUR
    convertToEUR(value, fromCurrency) {
        if (!fromCurrency || fromCurrency === 'EUR') return value || 0;
        const rate = this.state.rates[fromCurrency] || 1;
        return (value || 0) * rate;
    }

    // Helper to convert EUR value to target display currency
    convertFromEUR(valueEUR, toCurrency) {
        if (!toCurrency || toCurrency === 'EUR') return valueEUR;
        const rate = this.state.rates[toCurrency];
        if (rate && rate !== 0) {
            return valueEUR / rate;
        }
        return valueEUR;
    }

    // Persist Market Data
    saveMarketData(data) {
        this.setState({ lastMarketData: data });
    }

    // Add asset from market list
    addAssetFromMarket(marketAsset, type = 'investment') {
        const asset = {
            name: marketAsset.name,
            currency: marketAsset.symbol.toUpperCase(),
            value: 1, // Default 1 unit
            details: `Añadido desde Mercados del Mundo (${marketAsset.id})`
        };

        if (type === 'passive') {
            return this.addPassiveAsset({ ...asset, monthlyIncome: 0 });
        } else {
            return this.addInvestmentAsset(asset);
        }
    }

    // Convert from ANY currency to display currency
    convertValue(value, fromCurrency) {
        const valueEUR = this.convertToEUR(value, fromCurrency);
        return this.convertFromEUR(valueEUR, this.state.currency);
    }

    // ============================================
    // PASSIVE ASSETS
    // ============================================
    addPassiveAsset(asset) {
        const newAsset = { id: crypto.randomUUID(), createdAt: Date.now(), currency: 'EUR', ...asset };
        this.setState({ passiveAssets: [...this.state.passiveAssets, newAsset] });
        return newAsset;
    }

    updatePassiveAsset(id, updates) {
        this.setState({ passiveAssets: this.state.passiveAssets.map(a => a.id === id ? { ...a, ...updates } : a) });
    }

    deletePassiveAsset(id) {
        this.setState({ passiveAssets: this.state.passiveAssets.filter(a => a.id !== id) });
    }

    // ============================================
    // ACTIVE INCOMES
    // ============================================
    addActiveIncome(income) {
        const newIncome = { id: crypto.randomUUID(), createdAt: Date.now(), currency: 'EUR', ...income };
        this.setState({ activeIncomes: [...this.state.activeIncomes, newIncome] });
        return newIncome;
    }

    updateActiveIncome(id, updates) {
        this.setState({ activeIncomes: this.state.activeIncomes.map(i => i.id === id ? { ...i, ...updates } : i) });
    }

    deleteActiveIncome(id) {
        this.setState({ activeIncomes: this.state.activeIncomes.filter(i => i.id !== id) });
    }

    // ============================================
    // LIVING EXPENSES
    // ============================================
    addLivingExpense(expense) {
        const newExpense = { id: crypto.randomUUID(), createdAt: Date.now(), currency: 'EUR', ...expense };
        this.setState({ livingExpenses: [...this.state.livingExpenses, newExpense] });
        return newExpense;
    }

    updateLivingExpense(id, updates) {
        this.setState({ livingExpenses: this.state.livingExpenses.map(e => e.id === id ? { ...e, ...updates } : e) });
    }

    deleteLivingExpense(id) {
        this.setState({ livingExpenses: this.state.livingExpenses.filter(e => e.id !== id) });
    }

    // ============================================
    // OTHER EXPENSES
    // ============================================
    addOtherExpense(expense) {
        const newExpense = { id: crypto.randomUUID(), createdAt: Date.now(), currency: 'EUR', ...expense };
        this.setState({ otherExpenses: [...this.state.otherExpenses, newExpense] });
        return newExpense;
    }

    updateOtherExpense(id, updates) {
        this.setState({ otherExpenses: this.state.otherExpenses.map(e => e.id === id ? { ...e, ...updates } : e) });
    }

    deleteOtherExpense(id) {
        this.setState({ otherExpenses: this.state.otherExpenses.filter(e => e.id !== id) });
    }

    // ============================================
    // INVESTMENT ASSETS
    // ============================================
    addInvestmentAsset(asset) {
        const newAsset = { id: crypto.randomUUID(), createdAt: Date.now(), currency: 'EUR', isQuantity: false, ...asset };
        this.setState({ investmentAssets: [...this.state.investmentAssets, newAsset] });
        return newAsset;
    }

    updateInvestmentAsset(id, updates) {
        this.setState({ investmentAssets: this.state.investmentAssets.map(a => a.id === id ? { ...a, ...updates } : a) });
    }

    deleteInvestmentAsset(id) {
        this.setState({ investmentAssets: this.state.investmentAssets.filter(a => a.id !== id) });
    }

    // ============================================
    // LIABILITIES
    // ============================================
    addLiability(liability) {
        const newLiability = { id: crypto.randomUUID(), createdAt: Date.now(), currency: 'EUR', ...liability };
        this.setState({ liabilities: [...this.state.liabilities, newLiability] });
        return newLiability;
    }

    updateLiability(id, updates) {
        this.setState({ liabilities: this.state.liabilities.map(l => l.id === id ? { ...l, ...updates } : l) });
    }

    deleteLiability(id) {
        this.setState({ liabilities: this.state.liabilities.filter(l => l.id !== id) });
    }

    // ============================================
    // CALCULATIONS
    // ============================================
    sumItems(items, valueKey) {
        return items.reduce((sum, item) => {
            const val = item[valueKey] || 0;
            return sum + this.convertValue(val, item.currency);
        }, 0);
    }

    getPassiveIncome() { return this.sumItems(this.state.passiveAssets, 'monthlyIncome'); }
    getLivingExpenses() {
        const basic = this.sumItems(this.state.livingExpenses, 'amount');
        const liabilityPayments = this.sumItems(this.state.liabilities, 'monthlyPayment');
        return basic + liabilityPayments;
    }
    getNetPassiveIncome() { return this.getPassiveIncome() - this.getLivingExpenses(); }
    getInvestmentAssetsValue() {
        const passiveValue = this.sumItems(this.state.passiveAssets, 'value');
        const investmentValue = this.sumItems(this.state.investmentAssets, 'value');
        return passiveValue + investmentValue;
    }
    getTotalLiabilities() { return this.sumItems(this.state.liabilities, 'amount'); }
    getNetWorth() { return this.getInvestmentAssetsValue() - this.getTotalLiabilities(); }
    getAllIncomes() {
        const passive = this.getPassiveIncome();
        const active = this.sumItems(this.state.activeIncomes, 'amount');
        return passive + active;
    }
    getAllExpenses() {
        const living = this.getLivingExpenses();
        const other = this.sumItems(this.state.otherExpenses, 'amount');
        return living + other;
    }
    getNetIncome() { return this.getAllIncomes() - this.getAllExpenses(); }

    // ============================================
    // HEALTH METHODS
    // ============================================
    addWeightLog(weight) {
        const log = { id: crypto.randomUUID(), date: Date.now(), weight: parseFloat(weight) };
        this.setState({ health: { ...this.state.health, weightLogs: [...this.state.health.weightLogs, log] } });
    }

    addFatLog(fat) {
        const log = { id: crypto.randomUUID(), date: Date.now(), fat: parseFloat(fat) };
        this.setState({ health: { ...this.state.health, fatLogs: [...this.state.health.fatLogs, log] } });
    }

    saveRoutine(routine) {
        const routines = this.state.health.routines;
        const exists = routines.find(r => r.id === routine.id);
        const newRoutines = exists
            ? routines.map(r => r.id === routine.id ? routine : r)
            : [...routines, { ...routine, id: crypto.randomUUID() }];
        this.setState({ health: { ...this.state.health, routines: newRoutines } });
    }

    deleteRoutine(id) {
        this.setState({ health: { ...this.state.health, routines: this.state.health.routines.filter(r => r.id !== id) } });
    }

    renameRoutine(id, newName) {
        this.setState({
            health: {
                ...this.state.health,
                routines: this.state.health.routines.map(r => r.id === id ? { ...r, name: newName } : r)
            }
        });
    }

    updateExercise(routineId, exerciseIndex, updates) {
        this.setState({
            health: {
                ...this.state.health,
                routines: this.state.health.routines.map(r => {
                    if (r.id === routineId) {
                        const newExs = [...r.exercises];
                        newExs[exerciseIndex] = { ...newExs[exerciseIndex], ...updates };
                        return { ...r, exercises: newExs };
                    }
                    return r;
                })
            }
        });
    }

    addExerciseToRoutine(routineId, exercise) {
        this.setState({
            health: {
                ...this.state.health,
                routines: this.state.health.routines.map(r => {
                    if (r.id === routineId) {
                        return { ...r, exercises: [...r.exercises, { weight: 0, reps: 14, sets: 4, ...exercise }] };
                    }
                    return r;
                })
            }
        });
    }

    deleteExerciseFromRoutine(routineId, exerciseIndex) {
        this.setState({
            health: {
                ...this.state.health,
                routines: this.state.health.routines.map(r => {
                    if (r.id === routineId) {
                        const newExs = [...r.exercises];
                        newExs.splice(exerciseIndex, 1);
                        return { ...r, exercises: newExs };
                    }
                    return r;
                })
            }
        });
    }

    addCalorieLog(calories, note = '') {
        const log = { id: crypto.randomUUID(), date: Date.now(), calories: parseInt(calories), note };
        this.setState({ health: { ...this.state.health, calorieLogs: [...this.state.health.calorieLogs, log] } });
    }

    logExercise(routineId, exerciseIndex, rating) {
        const log = {
            id: crypto.randomUUID(),
            routineId,
            exerciseIndex,
            date: Date.now(),
            rating: parseInt(rating)
        };
        this.setState({
            health: {
                ...this.state.health,
                exerciseLogs: [...(this.state.health.exerciseLogs || []), log]
            }
        });
    }

    getExerciseStatus(routineId, exerciseIndex) {
        const logs = this.state.health.exerciseLogs || [];
        // Filter logs for this specific exercise
        const exerciseLogs = logs.filter(l => l.routineId === routineId && l.exerciseIndex === exerciseIndex);
        if (exerciseLogs.length === 0) return { color: 'green', lastDate: null };

        // Sort by date desc
        exerciseLogs.sort((a, b) => b.date - a.date);
        const lastLog = exerciseLogs[0];

        const now = new Date();
        const last = new Date(lastLog.date);

        // Reset hours to compare days roughly
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();

        const diffDays = (today - lastDay) / (1000 * 60 * 60 * 24);

        if (diffDays === 0) return { color: 'red', status: 'done_today', lastLog }; // Done today
        if (diffDays === 1) return { color: 'red', status: 'tired', lastLog }; // Done yesterday
        if (diffDays === 2) return { color: 'orange', status: 'recovering', lastLog }; // Done 2 days ago
        return { color: 'green', status: 'ready', lastLog }; // 3+ days
    }

    // ============================================
    // GOALS METHODS
    // ============================================
    addGoal(goal) {
        const newGoal = { id: crypto.randomUUID(), createdAt: Date.now(), completed: false, subGoals: [], ...goal };
        this.setState({ goals: [...this.state.goals, newGoal] });
    }

    toggleGoal(id) {
        this.setState({ goals: this.state.goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g) });
    }

    deleteGoal(id) {
        this.setState({ goals: this.state.goals.filter(g => g.id !== id) });
    }

    // ============================================
    // AGENDA METHODS
    // ============================================
    addEvent(event) {
        const newEvent = { id: crypto.randomUUID(), ...event };
        this.setState({ events: [...this.state.events, newEvent] });
        this.scheduleNotification(newEvent);
    }

    deleteEvent(id) {
        this.setState({ events: this.state.events.filter(e => e.id !== id) });
    }

    scheduleNotification(event) {
        if (!("Notification" in window) || Notification.permission !== "granted") return;
        console.log(`Scheduling notification for: ${event.title} at ${event.time}`);
    }
}

export const store = new Store();
