##Install
Clone the repository: `git clone https://github.com/akabab/intraX.git`

Get project dependencies: `npm install` **/!\** do this inside your project folder

##Nginx
Copy the nginx.conf to nginx install directory: `cp nginx.conf ~/.brew/etc/nginx/nginx.conf`

**/!\** Change both `/PATH/TO/THE/APP/` with your own application path

Reload nginx `nginx -s reload`

FORMAT: 1A

# asb2
Awesome Spaceships Battle II, aka ASB2, is a turn based full web strategy game
taking place in the universe of [Warhammer 4000](http://www.games-workshop.com/en-GB/Warhammer-40-000)
(&copy; Games Workshop ; All rights reserved)

# Group Notes
Notes related resources of the **Notes API**

## Notes Collection [/notes]
### List all Notes [GET]
+ Response 200 (application/json)

        [{
          "id": 1, "title": "Jogging in park"
        }, {
          "id": 2, "title": "Pick-up posters from post-office"
        }]

### Create a Note [POST]
+ Request (application/json)

        { "title": "Buy cheese and bread for breakfast." }

+ Response 201 (application/json)

        { "id": 3, "title": "Buy cheese and bread for breakfast." }

## Note [/notes/{id}]
A single Note object with all its details

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Note to perform action with. Has example value.

### Retrieve a Note [GET]
+ Response 200 (application/json)

    + Header

            X-My-Header: The Value

    + Body

            { "id": 2, "title": "Pick-up posters from post-office" }

### Remove a Note [DELETE]
+ Response 204

### Help me
+ Response
