import React, {FC, useEffect, useState} from 'react';
import {Grid} from "@material-ui/core";
import {Thread as ThreadComponent} from "../components/Thread";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {threadsCollection, timestampNow, useLoggedInUser} from "../utils/firebase";
import {Post, Thread} from "../utils/types";

const Home: FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);

    useEffect(() => {
        // Call .onSnapshot() to listen to changes
        const unsubscribe = threadsCollection.orderBy('date').onSnapshot(
            snapshot => {
                // Access .docs property of snapshot
                setThreads(snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        by: doc.data().by,
                        title: doc.data().title,
                        date: doc.data().date,
                        posts: doc.data().posts
                    }
                }));
            },
            err => console.log(err),
        );

        // Call unsubscribe in the cleanup of the hook
        return () => unsubscribe();
    }, []);

    const [text, setText] = useState('');
    const [title, setTitle] = useState('');

    const user = useLoggedInUser();

    const handleSubmit = () => {

        const post: Post = {
            by: {
                uid: user?.uid ?? '',
                email: user?.email ?? '',
            },
            content: text,
            date: timestampNow(),
        }

        threadsCollection.add({
            by: {
                uid: user?.uid ?? '',
                email: user?.email ?? '',
            },
            title: title,
            date: timestampNow(),
        }).then(response => {
            threadsCollection.doc(response.id).collection('posts').add(post);
        });
    };


    return (
    <Grid container wrap="wrap" spacing={3}>
    {threads.map((r, i) => (
        <Grid key={i} xs={12} item>
            <ThreadComponent thread={r} />
        </Grid>
    ))}
    <Grid xs={12} item>
        <Card>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Create thread
                </Typography>
                <TextField
                    label='Title'
                    name="title"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <TextField
                    label='Text'
                    name="text"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
            </CardContent>
            <CardActions>
                <Button
                    variant="text"
                    size="large"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </CardActions>
        </Card>
    </Grid>
</Grid>
)};

export default Home;