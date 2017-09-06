Configuration
=============

Currently there's only need for one environment valiable

```bash
CONNECTION_STRING="es://elasticsearch:9200/documents"
```

Setting up Elastic Search
=========================

This code will create the base document's index

```bash
curl -X PUT --data-binary @- elasticsearch:9200/documents <<EOF
{
	"mappings": {
		"document": {
			"properties": {
				"file": {
					"type": "attachment",
					"fields": {
						"content":       {"store": "yes"},
						"author":        {"store": "yes"},
						"title":         {"store": "yes"},
						"date":          {"store": "yes"},
						"keywords":      {"store": "yes"},
						"content_type":  {"store": "yes"}
					}
				}
			}
		}
	}
}
EOF
```


Testing API
===========

Search
------

Sample search on the API

```bash
curl app:3000/?q=dolor
```

Expected result:

```json
[
    {
        "_id": "AV5VuWnngZSFu5tYQPj0",
        "author": [
            "Giancarlo Palavicini"
        ],
        "content_type": [
            "application/pdf"
        ],
        "date": [
            "2017-09-04T21:32:21Z"
        ],
        "highlight": [
            "\nLorem ipsum <em>dolor</em> sit amet, consectetur adipiscing elit. Morbi ut nunc sit \namet nisi fermentum",
            " leo at \nmagna tincidunt auctor. Nunc tempor odio tellus, ut pellentesque <em>dolor</em> \ntempus nec. Duis a"
        ],
        "title": [
            "Lorem ipsum"
        ]
    }
]
```

Uploading
---------

be sure that there's a pdf called lorem in the current directory before running the following command

```bash
curl -X POST -H "Content-type: application/json" -d "{ \"file\": \"$(base64 lorem.pdf)\"}" app:3000/
```

Expected result:
```json
{"ok": 1}
```
