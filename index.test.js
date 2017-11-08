const { graphql } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");
const { find, filter } = require("lodash");
const addDefaultResolverToSchema = require("./");

// From graphql-tools example
const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

// example data
const authors = [
  { id: 1, firstName: "Tom", lastName: "Coleman" },
  { id: 2, firstName: "Sashko", lastName: "Stubailo" },
  { id: 3, firstName: "Mikhail", lastName: "Novikov" },
  { id: 4, firstName: "Bryan", lastName: "Goldstein" }
];
const posts = [
  { id: 1, authorId: 1, title: "Introduction to GraphQL", votes: 2 },
  { id: 2, authorId: 2, title: "Welcome to Meteor", votes: 3 },
  { id: 3, authorId: 2, title: "Advanced GraphQL", votes: 1 },
  { id: 4, authorId: 3, title: "Launchpad is Cool", votes: 7 },
  { id: 5, authorId: 4, title: "Mad hacks", votes: 1 }
];

const resolvers = {
  Query: {
    posts() {
      return posts;
    }
  },
  Mutation: {
    upvotePost(_, { postId }) {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    }
  },
  Author: {
    posts(author) {
      return filter(posts, { authorId: author.id });
    },
    lastName(author) { return author.lastName }
  },
  Post: {
    author(post) {
      return find(authors, { id: post.authorId });
    }
  }
};

test("uses resolvers you define, defaults to function you pass", async () => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  addDefaultResolverToSchema(schema, (obj, args, context, info) => {
    return "newdefault: " + obj[info.fieldName];
  });

  const result = graphql(
    schema,
    `
      query ExampleQuery {
        posts {
          title
          author {
          firstName
          lastName
          }
        }
      }
    `
  );

  expect(await result).toMatchSnapshot();
});
