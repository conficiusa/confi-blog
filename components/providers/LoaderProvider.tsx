"use client";

import { ReactNode, useState } from "react";
import Loader from "../animatedLogo";

const LoaderProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const onFinish = () => setIsLoading(false);
	return isLoading ? (
		<Loader finishLoading={onFinish} setIsLoading={setIsLoading} />
	) : (
		<>{children}</>
	);
};
export default LoaderProvider;
