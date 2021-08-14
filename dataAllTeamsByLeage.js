// 262 Mixico, liga Mx code: Temporada 2021 "año"
const getDataTeams = async (leageKey = 262) => {
	// mexico liga 262
	try {
		const date = new Date().getFullYear();
		const localKay = leageKey + "" + date;
		if (localStorage.getItem(localKay)) return JSON.parse(localStorage.getItem(localKay));
		const response = await fetch(
			`https://api-football-v1.p.rapidapi.com/v3/teams?league=${leageKey}&season=2021`,
			{
				method: "GET",
				headers: {
					"x-rapidapi-key": "1f58fae3e8msh8823ef98aea309bp1df350jsne6b9642c27f5",
					"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
				},
			}
		);
		console.log(response);
		if (!response.ok) throw new Error("Coudl't reach the league");
		const data = await response.json();
		localStorage.setItem(localKay, JSON.stringify(data));
		return data;
	} catch (e) {
		return e;
	}
};

export { getDataTeams };
