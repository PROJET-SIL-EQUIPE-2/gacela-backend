## Prisma ORM
Prisma is an ORM that maps tables to javascript objects.  
It facilitates database queries by simply chaining methods.  
Prisma relies on a file called `schema.prisma` where we define all of our models.

### Push to db
Create your schema in `schema.prisma` and run
```shell
  npx prisma db push 
```
A file named `@prisma/client` will be generated that holds schema models as js objects.  
You can use it by importing it like this
```javascript
const prismaPkg = require("@prisma/client")
const {PrismaClient} = prismaPkg
const prisma = new PrismaClient();
// Example  of  a qeury
let result = await prisma.students.findMany();
```

### Pull from db
You can make modifications on db tables directly and run
```shell
    npx  prisma db pull
```
the `schema.prisma` will updated and the `@prisma/client` will be created
