import { useState, useEffect } from "react";
import { parse } from "cookie";

export function userAuth() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const cookies = parse(document.cookie);
    setUserId(cookies.userId || "");
  }, []);

  return userId;
}
