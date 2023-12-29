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
	if (account.bankType === "eSewa") {
		bankLogo = require("../assets/bank_logos/eSewa.png");
	} else if (account.bankType.endsWith("NPKA")) {
		bankLogo = {
			uri: `https://raw.githubusercontent.com/ryuuzu/bank-logos/main/${account.bankType}.png`,
		};
	} else {
		bankLogo = require("../assets/main-logo.png");
	}
	return bankLogo;
};

export const getDefaultBankLogo = () => {
	return require("../assets/main-logo.png");
};
