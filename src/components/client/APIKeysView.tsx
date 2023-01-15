import classNames from "classnames";
import type { APIKey } from "../../types/types";

interface APIKeysViewProps {
  apiKeys: APIKey[];
  onClickAddAPIKey: () => void;
  onClickRevokeAPIKey: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function APIKeysView({
  apiKeys,
  onClickAddAPIKey,
  onClickRevokeAPIKey,
}: APIKeysViewProps) {
  return (
    <div className="pb-10">
      <h1 className="font-clover-medium text-3xl py-6">API Keys</h1>
      <table className="w-full border-collapse border-spacing-0">
        <thead className="bg-card-bg">
          <tr>
            <th className="p-4 text-left border-b-2 border-gray-200">API Key</th>
            <th className="p-4 text-left border-b-2 border-gray-200">Active</th>
            <th className="p-4 text-left border-b-2 border-gray-200">Options</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys
            ? apiKeys.map((apiKey) => {
                const keyClasses = classNames({
                  "p-4 text-left border-b-2 border-gray-200": true,
                  "line-through": !apiKey.active,
                  "text-gray-500": !apiKey.active,
                });
                const buttonClasses = classNames({
                  "w-full px-4 py-2 text-sm leading-5 duration-150 bg-gray-200 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-gray":
                    true,
                  "active:bg-gray-400 hover:bg-gray-300": apiKey.active,
                });
                return (
                  <tr key={apiKey.key}>
                    <td className={keyClasses}>{apiKey.key}</td>
                    <td className="p-4 text-left border-b-2 border-gray-200">
                      {apiKey.active ? "Yes" : "No"}
                    </td>
                    <td className="p-4 text-left border-b-2 border-gray-200">
                      <button
                        data-value={apiKey.key}
                        className={buttonClasses}
                        onClick={
                          apiKey.active
                            ? onClickRevokeAPIKey
                            : () =>
                                alert(
                                  "Delete functionality has not been implemented yet"
                                )
                        }
                      >
                        {/* TODO: Implement delete key functionality server-side */}
                        {apiKey.active ? "Revoke key" : "Delete key"}
                      </button>
                    </td>
                  </tr>
                );
              })
            : null}
          <tr>
            <td
              className="p-4 text-left border-b-2 border-gray-200"
              colSpan={3}
              style={{ textAlign: "center" }}
            >
              <button
                className="w-full px-4 py-2 text-sm leading-5 duration-150 bg-gray-200 border border-transparent rounded-lg active:bg-gray-400 hover:bg-gray-300 focus:outline-none focus:shadow-outline-gray"
                onClick={onClickAddAPIKey}
              >
                Add key
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default APIKeysView;
