import { useLocation } from "react-router-dom";

export default function AiBuilder() {
  const { state } = useLocation();

  if (!state) return <p>No resume data</p>;

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}
