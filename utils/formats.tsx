import { Account } from "../@types/Account";

export const getFormattedQrString = (account: Account) => {
	let formattedQrString: string;
	switch (account.bankType) {
		case "eSewa":
			formattedQrString = `{ "name": "${account.accountName}", "eSewa_id": "${account.accountNumber}" }`;
			break;
		default:
			formattedQrString = `{"accountNumber":"${
				account.accountNumber
			}","accountName":"${account.accountName.toUpperCase()}","bankCode":"${account.bankType.toUpperCase()}"}`;
			break;
	}
	return formattedQrString;
};

export const getBankLogo = (account: Account) => {
	let bankLogo;
	switch (account.bankType) {
		case "eSewa":
			bankLogo = require("../assets/bank_logos/eSewa.png");
			break;
		case "SIDDNPKA":
			bankLogo = require("../assets/bank_logos/SIDDNPKA.png");
			break;
		default:
			break;
	}
	return bankLogo;
};
