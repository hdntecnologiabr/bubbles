import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Router from "next/router";
import Link from 'next/link';

import { Bubble, Label, Comment } from "@prisma/client";
import prisma from '../../prisma/client';

import Header from '../components/Header/Header';
import BubbleListItem from "../components/BubbleListItem/BubbleListItem";
import FloatingButton from '../components/FloatingButton/FloatingButton';
import BubbleDetails from "../components/BubbleDetailsModal/BubbleDetailsModal";
import NewBubbleModal from "../components/NewBubbleModal/NewBubbleModal";

import postBubbles from '../services/postBubbles';
import postComments from '../services/postComments';
import postLabels from '../services/postLabels';
import alteredLabels from '../services/alteredLabels';

import styles from './_home.module.css';

export const getStaticProps: GetStaticProps = async () => {
  const bubblesResponse = await prisma.bubble.findMany({
    include: {
      labels: true,
      comments: {
        include: {
          author: {
            select: {
              avatarUrl: true,
              name: true,
            },
          },
        },
      },
      author: {
        select: {
          avatarUrl: true,
        },
      },
    },
  });

  const labels = await prisma.label.findMany();

  const serializableBubbles = bubblesResponse.map(bubble => ({
    ...bubble,
    createdAt: bubble.createdAt.toString(),

    comments: bubble.comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toString(),
    })),
  }));
  
  return {
    props: { bubbles: serializableBubbles, labels },
    revalidate: 1,
  };
};

type FilledComment = Comment & {
  author: {
    avatarUrl: string;
    name: string;
  };
};

type FilledBubble = Bubble & {
  labels: Label[];
  comments: FilledComment[];
  author: {
      avatarUrl: string;
  };
};

type Props = {
  bubbles: FilledBubble[];
  labels: Label[];
};

const HomePage: React.FC<Props> = (props: Props) => {
  const [ bubbles, setBubbles ] = useState<FilledBubble[]>([]);
  const [ isBubbleDetailsVisible, setIsBubbleDetailsVisible ] = useState(false);
  const [ oppenedBubbleId, setOppenedBubbleId ] = useState(null);
  const [ isNewBubbleModalVisible, setIsNewBubbleModalVisible ] = useState(false);

  useEffect(() => {
    setBubbles(props.bubbles.map(bubble => ({
      ...bubble,
      createdAt: new Date(bubble.createdAt),
    })));
  }, []);

  const postBubble = (bubblInfo, userInfo) => {
    postBubbles(bubblInfo, userInfo);
    setIsNewBubbleModalVisible(false);
  };

  const postComment = (newComment, userInfo) => {
    postComments(newComment, userInfo, oppenedBubbleId);
  };

  const postLabel = (newLabel) => {
    postLabels(newLabel, oppenedBubbleId);
  };

  const alteredLabel = (id, selectedLabel) => {
    alteredLabels(id , selectedLabel, oppenedBubbleId);
  };

  return (
    <div className={styles.homePage}>
      <main className={styles.container}>
        <Header/>

        <div className={styles.bubblesContainer}>

          {bubbles.map((bubble) => (
            <div key={bubble.id}>
              <Link href={`/?[id]=${bubble.id}`} as={`/bubbles/${bubble.id}`}>
                <BubbleListItem
                  onClick={() => {
                    setIsBubbleDetailsVisible(true);
                    setOppenedBubbleId(bubble.id)}
                  }
                  bubble={bubble}
                />
              </Link>

              {isBubbleDetailsVisible && bubble.id === oppenedBubbleId ?
                <BubbleDetails
                  onClose={() => {setIsBubbleDetailsVisible(false); Router.push('/')}}
                  bubble={bubble}
                  allLabels={props.labels}
                  onSubmitNewLabel={postLabel}
                  onConfigChange={alteredLabel}
                  onSubmitNewComment={postComment}
                />
              : null}
            </div>
          ))}

        </div>

        <Link href='/' as='/bubbles/new'>
          <FloatingButton 
            onClick={() => setIsNewBubbleModalVisible(true)} 
            isVisible={!isNewBubbleModalVisible && !isBubbleDetailsVisible}
          />
        </Link>

        {isNewBubbleModalVisible ?
          <NewBubbleModal
            onClose={() => {setIsNewBubbleModalVisible(false); Router.push('/')}}
            onSubmitNewBubble={postBubble}
          />
        : null}

      </main>
      <aside className={styles.menu}>

      </aside>
    </div>
  );
};

export default HomePage;