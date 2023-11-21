import { useEthers } from "@usedapp/core";

const useSignText = () => {
  const { library } = useEthers();

  const signText = async (text: string) => {
    if (!library) return;

    try {
      // @ts-ignore
      const signer = library.getSigner();
      return await signer.signMessage(text);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return signText;
};

export default useSignText;
