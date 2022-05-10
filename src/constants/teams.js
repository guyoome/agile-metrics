const TEAMS = [
    {
        tag: "CMP",
        name: "Loyalty",
        type: "scrum",
        id: "6",
        swimlaneId: "7",
        columnId: ["34", "36"],
    },
    {
        tag: "ORC",
        name: "Journey",
        type: "scrum",
        id: "75",
        swimlaneId: "131",
        columnId: ["708", "710"],

    },
    {
        tag: "SCF",
        name: "Marketing Auto",
        type: "scrum",
        id: "26",
        swimlaneId: "45",
        columnId: ["199", "201"],
    },
    {
        tag: "MW",
        name: "Mobile Wallet",
        type: "scrum",
        id: "72",
        swimlaneId: "126",
        columnId: ["663", "665"],
    },
    {
        tag: "DATA",
        name: "Data",
        type: "scrum",
        id: "70",
        swimlaneId: "122",
        columnId: ["636", "638"],
    },
    {
        tag: "OPS",
        name: "Tech Ops",
        type: "scrum",
        id: "28",
        swimlaneId: "51",
        columnId: ["225", "227"],
    },
    {
        tag: "SHT",
        name: "Shanghai Team",
        type: "scrum",
        id: "29",
        swimlaneId: "52",
        columnId: ["231", "233"],
    },
    {
        tag: "ACID",
        name: "ACID",
        type: "kanban",
        id: "74",
        swimlaneId: "130",
        columns: [
            { name: "Backlog", id: "688", active: false },
            { name: "To Be Refined", id: "1037", active: false },
            { name: "To Do", id: "689", active: false },
            { name: "In Progress", id: "690", active: true },
            { name: "To Be Reviewed", id: "695", active: true },
            { name: "Done", id: "691", active: false },
        ],
    },
    {
        tag: "TKF",
        name: "Yumiko Taskforce",
        type: "kanban",
        id: "77",
        swimlaneId: "140",
        columns: [
            { name: "Backlog", id: "828", active: false },
            { name: "To Do", id: "829", active: false },
            { name: "In Progress", id: "830", active: true },
            { name: "To Be Reviewed", id: "834", active: true },
            { name: "To Be Released", id: "892", active: true },
            { name: "Done", id: "831", active: false },
        ],
    }

]

export default TEAMS;