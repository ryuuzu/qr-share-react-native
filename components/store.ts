import { create } from "zustand";
import { TGlobalStore } from "./types";
import { readData, saveData } from "../utils/filemanager";

export const useGlobalStore = create<TGlobalStore>((set, get) => ({
	accounts: [],
	saveAccounts: async () => {
		await saveData(get().accounts);
	},
	addAccount: (newAccount) => {
		set((state) => ({
			accounts: [...state.accounts, newAccount],
		}));
	},
	deleteAccount: (account) => {
		if (get().activeAccount?.id === account.id) {
			set({ activeAccount: null });
		}

		if (get().selectedAccount?.id === account.id) {
			set({ selectedAccount: null });
		}

		set((state) => ({
			accounts: state.accounts.filter((acc) => acc !== account),
		}));
	},
	loadAccounts: async () => {
		const accounts = await readData();
		set({ accounts });
		return accounts;
	},
	activeAccount: null,
	selectedAccount: null,
	setActiveAccount: (account) => {
		set({ activeAccount: account });
	},
	setSelectedAccount: (account) => {
		set({ selectedAccount: account });
	},
}));
