import { convertToRaw, EditorState } from 'draft-js';
import * as React from 'react';
import { useState, Fragment } from 'react';
import Layout from '@/components/layout/Layout';
import TextEditor, { IFile } from '@/components/TextEditor';
import Card from '@mui/material/Card';
import { Button, Grid, Typography, useTheme } from '@mui/material';
import Attachment from '@/components/Attachment/Attachment';

export default function HomePage() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [attachedFiles, setAttachedFile] = useState<IFile[]>([]);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(attachedFiles);
    console.log(convertToRaw(editorState.getCurrentContent()));
  };

  return (
    <Layout>
      <main>
        <section className='bg-white'>
          <Card>
            <div className='layout flex min-h-screen py-20'>
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={7}>
                    <TextEditor
                      editorState={editorState}
                      setEditorState={setEditorState}
                      setAttachedFile={setAttachedFile}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Typography component='h1' variant='h5'>
                      Attachments
                    </Typography>
                    <Attachment attachedFiles={attachedFiles} />
                  </Grid>
                  <Grid item xs={4} style={{ marginTop: '50px' }}>
                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      color='primary'
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Card>
        </section>
      </main>
    </Layout>
  );
}
