const TEAMS = {
    list: [
        {
            tag: "CMP",
            name: "Loyalty",
            id: "6"
        },
        {
            tag: "ORC",
            name: "Journey",
            id: "75"
        },
        {
            tag: "SCF",
            name: "Marketing Auto",
            id: "26"
        },
        {
            tag: "MW",
            name: "Mobile Wallet",
            id: "72"
        },
        {
            tag: "DATA",
            name: "Data",
            id: "70"
        },
        {
            tag: "OPS",
            name: "Tech Ops",
            id: "28"
        },
    ],
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
    }

}

export default TEAMS;