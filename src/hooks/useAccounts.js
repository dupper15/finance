import { useEffect, useRef } from "react";
import { useFinance } from "../context/FinanceContext.js";

export function useAccounts() {
	const {
		accounts,
		loading,
		loadAccounts,
		createAccount,
		updateAccount,
		deleteAccount,
	} = useFinance();

	const hasLoadedOnce = useRef(false);

	useEffect(() => {
		if (!hasLoadedOnce.current && !loading.accounts && accounts.length === 0) {
			hasLoadedOnce.current = true;
			loadAccounts();
		}
	}, [accounts.length, loading.accounts]);

	return {
		accounts,
		loading: loading.accounts,
		createAccount,
		updateAccount,
		deleteAccount,
		refetch: loadAccounts,
	};
}
