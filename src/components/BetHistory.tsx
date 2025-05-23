export default function History() {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Bet History</h2>

      <div className="max-h-86 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payout
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {betHistory.map((bet, index) => (
              <tr key={index} className={bet.won ? "bg-green-50" : "bg-red-50"}>
                <td className="px-4 py-2 whitespace-nowrap">
                  {bet.betAmount.toFixed(4)} MON
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="inline-flex items-center">
                    {bet.winningNumber.toFixed()}
                    <span className="ml-2 text-xs text-gray-500">
                      (Win ≤ {bet.userNumber.toFixed(2)})
                    </span>
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {bet.won ? (
                    <span className="text-green-600 font-medium">Win</span>
                  ) : (
                    <span className="text-red-600 font-medium">Loss</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {bet.won ? `${bet.payout.toFixed(4)} MON` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
