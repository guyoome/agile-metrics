import TEAMS from "../constants/TEAMS";

const Teams = {
    list: TEAMS,
    getTags: function () {
        const tags = [];
        this.list.forEach(team => {
            tags.push(team.tag)
        });
        return tags;
    },
    getTeamByTag: function (tag) {
        let teamByTag = "";
        this.list.forEach(team => {
            if (tag === team.tag) {
                teamByTag = team;
            }
        });
        return teamByTag;
    },
    getVelocityOf: async function  (tag) {
        const team = this.getTeamByTag(tag);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic Z21hdXJpbkBzcGxpby5jb206b280cFE5VzBYTDdJbExJblk0U3k5MDc5");
        myHeaders.append("Cookie", "atlassian.xsrf.token=BNWZ-WAR4-YNI8-IQN1_739802b74faefc4635c22ea101562fd664a25d54_lin");
        myHeaders.append("Accept", "application/json")

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const res = await fetch(`https://maur-proxy.herokuapp.com/https://spolio.atlassian.net/rest/greenhopper/1.0/rapid/charts/velocity.json?rapidViewId=${team.id}`, requestOptions);
        console.log("🎪res",res)
        const json = await res.json();
        return json;
            // .then(res => res.json())
            // .catch(error => console.log('error', error));
    }

}

export default Teams;