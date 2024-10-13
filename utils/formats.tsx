import { Account } from "../@types/account";

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
