const needle = require("needle");

const token = process.env.BEARER_TOKEN;
const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";

// Edit rules as desired below
const rules = [
  {
    value: '-is:reply -is:retweet "@_motionbox render"',
  },
];

export async function getAllRules() {
  const response = await needle("get", rulesURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (response.statusCode !== 200) {
    console.log("Error:", response.statusMessage, response.statusCode);
    throw new Error(response.body);
  }

  return response.body;
}

export async function deleteAllRules(rules: any) {
  if (!Array.isArray(rules.data)) {
    return null;
  }

  const ids = rules.data.map((rule: any) => rule.id);

  const data = {
    delete: {
      ids: ids,
    },
  };

  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body);
  }

  return response.body;
}

export async function setRules() {
  const data = {
    add: rules,
  };

  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.statusCode !== 201) {
    throw new Error(response.body);
  }

  return response.body;
}
