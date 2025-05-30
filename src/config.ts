import { http, createConfig } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});
