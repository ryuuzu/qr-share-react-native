import { useState } from "react";
import { View } from "react-native";
import { TextInput, Dialog, Button } from "react-native-paper";

type AccountFormProps = {
	hideForm: () => void;
	submitForm: (
		name: string,
		accountNumber: string,
		accountName: string,
		bankType: string
	) => boolean;
};

export const AccountForm = ({ hideForm, submitForm }: AccountFormProps) => {
	const [name, setName] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [accountName, setAccountName] = useState("");
	const [bankType, setBankType] = useState("");

	const resetForm = () => {
		setName("");
		setAccountNumber("");
		setAccountName("");
		setBankType("");
	};

	return (
		<>
			<Dialog.Title>Account Details</Dialog.Title>
			<Dialog.Content>
				<TextInput
					label="Name"
					value={name}
					mode="outlined"
					onChangeText={(text) => setName(text)}
				/>
				<TextInput
					label="Account Number"
					value={accountNumber}
					mode="outlined"
					onChangeText={(text) => setAccountNumber(text)}
				/>
				<TextInput
					label="Account Name"
					value={accountName}
					mode="outlined"
					onChangeText={(text) => setAccountName(text)}
				/>
				<TextInput
					label="Bank Type"
					value={bankType}
					mode="outlined"
					onChangeText={(text) => setBankType(text)}
				/>
			</Dialog.Content>
			<Dialog.Actions>
				<Button
					labelStyle={{ color: "red" }}
					onPress={() => hideForm()}
				>
					Cancel
				</Button>
				<Button
					onPress={() => {
						submitForm(name, accountNumber, accountName, bankType);
					}}
				>
					Submit
				</Button>
			</Dialog.Actions>
		</>
	);
};
