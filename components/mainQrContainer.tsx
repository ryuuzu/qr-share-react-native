import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { getFormattedQrString } from "../utils/formats";
import QRCode from "react-native-qrcode-svg";
import { FAB } from "react-native-paper";
import React from "react";
import { useGlobalStore } from "./store";

type MainQrContainerProps = {};

export const MainQrContainer = ({}: MainQrContainerProps) => {
	const { activeAccount: account } = useGlobalStore();

	return (
		<View style={styles.mainQrContainer}>
			{account ? (
				<>
					<Image
						source={`https://raw.githubusercontent.com/ryuuzu/bank-logos/refs/heads/main/${account.bankType}.png`}
						placeholder={require("../assets/main-logo.png")}
						style={styles.bankLogo}
						placeholderContentFit="contain"
						allowDownscaling
						contentFit="contain"
					/>
					<QRCode value={getFormattedQrString(account)} size={270} />
					<Text style={styles.qrDescription}>{account.name}</Text>
				</>
			) : (
				<Text>No account selected</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	mainQrContainer: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		// backgroundColor: "#c3c5c6",
		justifyContent: "center",
		rowGap: 10,
	},
	bankLogo: {
		width: 270,
		height: 100,
		objectFit: "contain",
	},
	qrDescription: {
		fontSize: 20,
		fontWeight: "600",
	},
});
