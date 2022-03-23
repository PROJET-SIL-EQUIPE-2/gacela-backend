# gacela-backend
Backend REST API for Gacela App

# App structure
You can check readmes under each directory of the application

# Contribution
Please check `CONTRIBUTION.md` file

# Gecela backend response format
In case of success
```json 
{
    "success": true,
    "data": {
        // Data object
    },
}
```
In case of errors

```json
{
  "errors": [
    {
      "msg": "Error message here"
    }
  ]
}
```