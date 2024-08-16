import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { verify } from "hono/jwt";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from 'hono';
import { createBlogInput, updateBlogInput } from "@numanfaisal/medium-common";

// Extend the Context interface to include the custom properties
interface CustomContext extends Context {
    userId?: string;
}

export const blogRouter =  new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>()


blogRouter.use('/*', async (c: CustomContext, next)  => {
    // Extract the Authorization header
    const authHeader = c.req.header("authorization") || "";

    try {
        // Verify the token directly
        const user = await verify(authHeader, c.env.JWT_SECRET);

        if (user) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            });
        }
    } catch (error) {
        c.status(401);
        return c.json({
            message: "You are not logged in"
        });
    }
});


blogRouter.post('/', async (c) => {
    const body = await c.req.json();
	const {success} = createBlogInput.safeParse(body);
	if (!success) {
		c.status(404);
		return c.json({
			message: "Inputs not correct"
		})
	}

    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    })

    return c.json({
        id:  blog.id
    })

})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
	const {success} = updateBlogInput.safeParse(body);
	if (!success) {
		c.status(404);
		return c.json({
			message: "Inputs not correct"
		})
	}


    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })

    return c.json({
        id:  blog.id
    })
})

// pagination
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const allPost = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    return c.json({
        allPost
    })
})

blogRouter.get('/:id', async (c) => {
	const id =  c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
    
        return c.json({
            blog
        })
        
    } catch (error) {
        c.status(404);
        return c.json({
            message: "Error while fetching blog post"
        });
    }

})
