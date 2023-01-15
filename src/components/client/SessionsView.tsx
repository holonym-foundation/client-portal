import type { ProofSession } from "../../types/types";

interface SessionsViewProps {
  sessions: ProofSession[];
}

function SessionsView({ sessions }: SessionsViewProps) {
  function copyCode() {
    const code = `const config = {
    headers: {
      "X-API-KEY": "YOUR_API_KEY",
    },
  }
  const url = "https://id-server.holonym.io/sessions/";
  const resp = await axios.post(url, {}, config);
  const { sessionId } = resp.data;`;
    navigator.clipboard
      .writeText(code ?? "")
      .then(() => {
        console.log("Code copied to clipboard");
      })
      .catch((err) => {
        console.log("Error occured while copying: ", err);
      });
  }

  return (
    <div>
      <h1 className="font-clover-medium text-3xl py-6">Sessions</h1>
      <div>
        <div className="text-lg leading-9">
          <p>Total Sessions: {sessions?.length ?? 0}</p>
          <p>
            Total Sessions Consumed:{" "}
            {sessions?.filter((session) => session.consumedAt).length ?? 0}
          </p>
        </div>
        <div>
          <div className="font-mono bg-gray-800 rounded-lg p-4 mt-8">
            <div className="flex justify-between">
              <h2 className="text-xl font-clover-medium font-bold text-blue-400">
                Create a session
              </h2>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white ease-in-out duration-200 text-sm rounded-lg px-4 py-2"
                onClick={copyCode}
                aria-label="Copy code to clipboard"
                title="Copy code to clipboard"
              >
                Copy code
              </button>
            </div>
            <pre id="code-to-copy" className="text-white">
              <code>
                {`1. const config = {
2.   headers: {
3.     "X-API-KEY": "YOUR_API_KEY",
4.   },
5. }`}
              </code>
              <br />
              <code>{`6. const url = "https://id-server.holonym.io/sessions/";`}</code>
              <br />
              <code>{`7. const resp = await axios.post(url, {}, config);`}</code>
              <br />
              <code>{`8. const { sessionId } = resp.data;`}</code>
            </pre>
          </div>
        </div>
      </div>
      <table className="w-full border-collapse mt-8 border-spacing-0">
        <thead className="bg-card-bg">
          <tr>
            <th className="p-4 text-left border-b-2 border-gray-200">Session ID</th>
            <th className="p-4 text-left border-b-2 border-gray-200">Created at</th>
            <th className="p-4 text-left border-b-2 border-gray-200">Consumed at</th>
          </tr>
        </thead>
        <tbody>
          {sessions
            ? sessions.map((session) => (
                <tr key={session.sessionId}>
                  <td className="p-4 text-left border-b-2 border-gray-200">
                    {session.sessionId}
                  </td>
                  <td className="p-4 text-left border-b-2 border-gray-200">
                    {typeof session.createdAt == "number"
                      ? new Date(session.createdAt).toISOString()
                      : null}
                  </td>
                  <td className="p-4 text-left border-b-2 border-gray-200">
                    {typeof session.consumedAt == "number"
                      ? new Date(session.consumedAt).toISOString()
                      : null}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}

export default SessionsView;
