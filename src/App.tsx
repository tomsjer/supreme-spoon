import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { DynamoDBClient, ListTablesCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import './App.css'

const AWSService = async () => {
  const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: "us-east-2" },
      identityPoolId: "us-east-2:f5dec6b9-f7df-4397-b7bc-4188621a5a4e"
    })
  });
  try {
    const command = new ListTablesCommand({});
    const results = await client.send(command);
    console.log("Available tables:", results.TableNames?.join(", "));

    results.TableNames?.forEach(async tableName => {
      const elements = await client.send(new ScanCommand({ TableName: tableName }))
      console.log(elements)
    })

    return results;
  } catch (error) {
    console.error("AWS Integration Error:", error);
    throw error;
  }
};

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    AWSService()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
