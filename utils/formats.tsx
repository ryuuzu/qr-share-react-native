type Account = {
	accountNumber: string;
	name: string;
	bankType: string;
};

export const getFormattedQrString = (account: Account) => {
	let formattedQrString: string;
	switch (account.bankType) {
		case "eSewa":
			formattedQrString = `{ "name": "${account.name}", "eSewa_id": "${account.accountNumber}" }`;
			break;
		default:
			formattedQrString = "failed";
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
		default:
			break;
	}
	return bankLogo;
};
