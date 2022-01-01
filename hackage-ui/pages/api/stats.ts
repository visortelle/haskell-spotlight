// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Stats = {
  downloadsTotal: number;
  packagesTotal: number;
};

let stats: Stats = { downloadsTotal: 0, packagesTotal: 0 };

async function refreshStats(): Promise<void> {
  const packages = await (
    await axios("https://hackage.haskell.org/packages/", {
      headers: { "Content-Type": "application/json" },
    })
  ).data;
  stats = { downloadsTotal: 0, packagesTotal: packages.length };
}

setInterval(async () => {
  await refreshStats();
}, 10 * 1000);

function getStats(): Stats {
  return stats;
}

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<Stats>
) {
  res.status(200).json(getStats());
}
