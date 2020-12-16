import { create } from "../labels/_repository";

export default async (req, res) => {
  if (req.method === 'POST') {
    const { content, bubbleId, author } = req.body;

    try {
      const createdComment = await create(
        bubbleId,
        author,
        content,
      );
      res.statusCode = 200;
      res.json(createdComment);
    } catch (err) {
      res.statusCode = 500;
      res.json(err);
    };
  };
};
