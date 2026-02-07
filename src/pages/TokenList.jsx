import { useEffect, useState } from "react";
import api from "../config/axios";

/* 🔐 SAFE JSON PARSER */
const parseLiquidity = (liquidityResponse) => {
  if (!liquidityResponse) return null;

  try {
    const data =
      typeof liquidityResponse === "string"
        ? JSON.parse(liquidityResponse)
        : liquidityResponse;

    return {
      pairAddress: data.pairAddress || null,
      lpLocked:
        data.lpLocked &&
        data.lpLocked !== "0" &&
        data.lpLocked !== 0
          ? true
          : false,
      lpLockedRaw: data.lpLocked || null,
    };
  } catch (e) {
    console.error("Invalid liquidityResponse JSON", e);
    return null;
  }
};


export default function TokenList() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await api.get("/token-flow/tokens", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTokens(res.data.data || []);
    } catch (err) {
      console.error("Tokens fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading tokens...</p>;

  return (
    <>
      <div className="pagetitle">
        <h1>Launched Tokens</h1>
      </div>

      <section className="section">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Token List</h5>

            <div style={{ overflowX: "auto" }}>
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Chain</th>
                    <th>Supply</th>
                    <th>Creator</th>
                    <th>Status</th>
                    <th>Pair Address</th>   {/* 🆕 */}
                    <th>LP Locked</th>      {/* 🆕 */}
                    <th>LP Locked Row</th>      {/* 🆕 */}
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {tokens.map((token, index) => {
                    /* 👇 YAHI PAR ADD HOTA HAI */
                    const liquidity = parseLiquidity(
                      token.liquidityResponse
                    );

                    return (
                      <tr key={token.id}>
                        <td>{index + 1}</td>
                        <td>{token.name}</td>
                        <td>{token.symbol}</td>
                        <td>{token.chain}</td>
                        <td>{Number(token.supply).toFixed(6)}</td>

                        <td>
                          <td>
                            <a
                              href={`https://sepolia.etherscan.io/address/${token.creatorWallet}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {token.creatorWallet}
                            </a>
                          </td>

                        </td>

                        <td>
                          <span
                            className={
                              token.status === "COMPLETED"
                                ? "badge bg-success"
                                : token.status === "FAILED"
                                ? "badge bg-danger"
                                : "badge bg-warning"
                            }
                          >
                            {token.status}
                          </span>
                        </td>

                        {/* 🔗 Pair Address */}
                        <td>
                          {liquidity?.pairAddress ? (
                            <a
                              href={`https://sepolia.etherscan.io/address/${liquidity.pairAddress}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {liquidity.pairAddress}
                            </a>
                          ) : "-"}
                        </td>

                        {/* 🔒 LP Locked */}
                        <td>
                          {liquidity?.lpLocked ? (
                            <span className="badge bg-success">Locked</span>
                          ) : (
                            <span className="badge bg-danger">Not Locked</span>
                          )}
                        </td>
                        <td>
                          {liquidity?.lpLockedRaw
                            ? liquidity.lpLockedRaw
                            : "-"}
                        </td>


                        <td>
                          {new Date(
                            token.createdAt
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
