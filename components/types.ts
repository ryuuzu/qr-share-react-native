import { Account } from "../@types/account";

export type TGlobalStore = {
	accounts: Account[];
	addAccount: (newAccount: Account) => void;
	deleteAccount: (account: Account) => void;
	saveAccounts: () => Promise<void>;
	loadAccounts: () => Promise<Account[]>;
	activeAccount: Account | null;
	selectedAccount: Account | null;
	setActiveAccount: (account: Account | null) => void;
	setSelectedAccount: (account: Account | null) => void;
};
