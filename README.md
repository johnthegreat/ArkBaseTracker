# ArkBaseTracker

**Note: This project is a backend application only and does not include a frontend.**

This project is a backend application to help keep track of points of interest and base locations across different clusters, servers, and maps in the video game `ARK: Survival Evolved`.

## API Documentation

### Cluster

#### Fields

| Field       | Description                        |
|-------------|------------------------------------|
| `uuid`      | UUID (Auto Generated)              |
| `name`      | Cluster Name. `VARCHAR(100)`       |
| `type`      | Cluster Type. Enum: `PVE` or `PVP` |
| `createdAt` | Created At Date/Time               |
| `updatedAt` | Updated At Date/Time               |

#### Routes

```
GET /api/cluster
GET /api/cluster/:uuid
POST /api/cluster
PUT /api/cluster/:uuid
DELETE /api/cluster/:uuid
```

#### Example Response

```
{
    "uuid": "198dea18-5941-41d3-a330-e156ea108a2d",
    "name": "Official PVE",
    "type": "PVE",
    "createdAt": "2021-10-06T19:01:31.662Z",
    "updatedAt": "2021-10-06T19:01:31.662Z"
}
```

### Server

#### Fields

| Field         | Description                 |
|---------------|-----------------------------|
| `uuid`        | UUID (Auto Generated)       |
| `clusterUuid` | Cluster UUID                |
| `serverName`  | Server Name. `VARCHAR(255)` |
| `mapType`     | Map Name. `VARCHAR(255)`    |
| `createdAt`   | Created At Date/Time        |
| `updatedAt`   | Updated At Date/Time        |

#### Routes

```
GET /api/cluster/:uuid/server
GET /api/cluster/:uuid/server/:serverUuid
POST /api/cluster/:uuid/server
PUT /api/cluster/:uuid/server/:serverUuid
DELETE /api/cluster/:uuid/server/:serverUuid
```

#### Example Response

```
{
    "uuid": "9092bc77-5e77-42ce-94c5-af3b27e528b2",
    "clusterUuid": "198dea18-5941-41d3-a330-e156ea108a2d",
    "serverName": "NA-PVE-Official-CrystalIsles834",
    "mapType": "Crystal Isles",
    "createdAt": "2021-10-06T19:02:26.434Z",
    "updatedAt": "2021-10-06T19:02:26.434Z"
}
```

### Point Of Interest

#### Fields

| Field            | Description                                                                           |
|------------------|---------------------------------------------------------------------------------------|
| `uuid`           | UUID (Auto Generated)                                                                 |
| `serverUuid`     | Server UUID                                                                           | 
| `type`           | Type. `Base` or `Point of Interest`                                                   |
| `ownerName`      | Base Owner Name (Nullable)                                                            |
| `allianceStatus` | Alliance Status (Nullable). Enum: `Allied`, `Friendly`, `Neutral`, `Hostile`, `Enemy` |
| `lat`            | Latitude `DECIMAL(3,1)`                                                               |
| `lng`            | Longitude `DECIMAL(3,1)`                                                              |
| `description`    | Description (Nullable)                                                                |
| `createdAt`      | Created At Date/Time                                                                  |
| `updatedAt`      | Updated At Date/Time                                                                  |

#### Routes

```
GET /api/cluster/:uuid/server/:serverUuid/point-of-interest
GET /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid
POST /api/cluster/:uuid/server/:serverUuid/point-of-interest
PUT /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid
DELETE /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid
```

#### Example Response

```
{
    "uuid": "0fa9d7a9-a05c-4300-a8b5-554744f1fb77",
    "serverUuid": "9092bc77-5e77-42ce-94c5-af3b27e528b2",
    "type": "Point of Interest",
    "ownerName": "Oil Cave",
    "allianceStatus": "Neutral",
    "wiped": false,
    "lat": 49.7,
    "lng": 53.6,
    "description": null,
    "createdAt": "2021-10-12T04:27:02.436Z",
    "updatedAt": "2021-10-12T04:27:02.436Z"
}
```

### Point Of Interest Attachment

#### Fields

| Field                 | Description                                                     |
|-----------------------|-----------------------------------------------------------------|
| `uuid`                | UUID (Auto Generated)                                           |
| `pointOfInterestUuid` | Point of Interest UUID                                          |
| `originalFileName`    | Original Uploaded File Name (Internal Use Only). `VARCHAR(255)` |
| `bucketName`          | Bucket Name to Store File (Internal Use Only). `VARCHAR(255)`   |
| `objectName`          | Object Name to Store File (Internal Use Only). `VARCHAR(255)`   |
| `createdAt`           | Created At Date/Time                                            |
| `updatedAt`           | Updated At Date/Time                                            |

#### Routes

```
GET /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment
GET /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment/:pointOfInterestAttachmentUuid
POST /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment
DELETE /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment/:pointOfInterestAttachmentUuid
```

#### Example Response

```
{
    "uuid": "bcdb162e-824a-4fbc-a454-4284529d4646",
    "pointOfInterestUuid": "a3424cdc-742c-4104-b5ce-9c7cf57b4e2b",
    "originalFileName": "ARK  Survival Evolved Screenshot 2019.07.14 - 18.05.37.85.png",
    "bucketName": "arkbasetracker-data",
    "objectName": "f4e9f7d8b8350b67284e9179ffa032d4b4fb19de.png",
    "createdAt": "2021-10-11T02:30:16.261Z",
    "updatedAt": "2021-10-11T02:30:16.261Z"
}
```

## How-To

### Working with Point of Interest Attachment Images

#### Upload Instructions

Make a `multipart/form-data` request to:

`POST /api/cluster/:uuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid/attachment`

Expected Post Body:

| Field  | Description                                    |
|--------|------------------------------------------------|
| `file` | Image File to Upload (from `input[type=file]`) |

#### Download Instructions

To get the actual attachment image:

`GET /upload/:pointOfInterestAttachmentUuid`

This endpoint also takes in an optional width/height to dynamically resize (e.g. for thumbnails). Example of a `wh` would be `640x360`

`GET /upload/:pointOfInterestAttachmentUuid/thumbnail/:wh`

Example:

`GET /upload/ad561673-34c0-4c6e-90aa-f707781de518/thumbnail/640x360`

## License

Copyright © 2021 John Nahlen

`GPL-3.0-or-later`

See `LICENSE.txt`.
