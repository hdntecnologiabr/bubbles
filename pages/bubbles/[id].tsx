import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Bubble } from "@prisma/client";
import DBClient from '../../prisma/client';

const prisma = DBClient.getInstance().prisma;

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get bubbles
  const bubbles = await prisma.bubble.findMany({
    select: {
      id: true
    },
  });

  // Get the paths we want to pre-render based on bubbles
  const paths = bubbles.map((bubble) => ({ params: { id: `${bubble.id}` }}))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths: paths, fallback: false }
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // params contains the post `id`.
  // If the route is like /bubbles/1, then params.id is 1
  const bubble = await prisma.bubble.findOne({
    where: {
      id: parseInt(params.id as string)
    },
  });

  const serializableBubble = {
    ...bubble,
    createdAt: bubble.createdAt.toDateString()
  }
  // Pass post data to the page via props
  return { props: { bubble: serializableBubble } }
}

type Props = {
  bubble: Bubble;
};

const BubblePage: React.FC<Props> = ({ bubble }: Props) => (
  <>
    TO DO - render Bubble
    <p>{bubble.id}</p>
    <p>{bubble.title}</p>
    <p>{bubble.authorId}</p>
    <p>{bubble.content}</p>
    <p>{bubble.createdAt}</p>
    <p>{bubble.description}</p>
  </>
);

export default BubblePage