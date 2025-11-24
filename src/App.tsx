import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const fetchCustomers = async () => {
    const { data: customers } = await client.models.customers.list()
    console.log(customers);
  }


  useEffect(() => {
    fetchCustomers()
  }, []);


  return (
    <>
      <h1>Home</h1>
      <Link to='/login'>Login</Link>
      <ul>
        {todos.map(({ id, content }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
    </>
  )
}

export default App
