const children = [
    {
        object: 'block',
        type: "toggle",
        toggle: {
            text: [{
                type: "text",
                text: {
                    content: "Lacinato kale - 👋🎯",
                    link: null
                },
                annotations: {
                    bold: true
                }
            }],
            children: [{
                object: 'block',
                type: "paragraph",
                paragraph: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: 'Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.',
                            },
                        },
                    ],
                },

            }]
        }
    }
];

const create = () => {
    const page = {
        parent: {
            type: "page_id",
            page_id: "1c248675a7f844019c944087eab3c351"
        },
        icon: {
            type: "emoji",
            emoji: "🎠"
        },
        properties: {
            title: [
                {
                    text: {
                        content: 'Tuscan Kale',
                    },
                },
            ],
        },
        children: []
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_NOTION_API_KEY}`
        },
        body: JSON.stringify(page)
    };
    // Get Epic list
    fetch(`${process.env.REACT_APP_PROXY}/https://api.notion.com/v1/pages`, requestOptions)
        .then(response => response.json())
        .then(response => { console.log(response); write(response.id, children) })
        .catch(err => console.error(err));
}

const write = (blockId, children) => {

    const requestOptions = {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_NOTION_API_KEY}`
        },
        body: JSON.stringify({ children })
    };

    fetch(`${process.env.REACT_APP_PROXY}/https://api.notion.com/v1/blocks/${blockId}/children`, requestOptions)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

const read = (blockId) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_NOTION_API_KEY}`
        },
    };

    fetch(`${process.env.REACT_APP_PROXY}/https://api.notion.com/v1/blocks/${blockId}/children`, requestOptions)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

export {
    create,
    write,
    read
}
// https://frost-spade-6f0.notion.site/Agile-metrics-API-1c248675a7f844019c944087eab3c351