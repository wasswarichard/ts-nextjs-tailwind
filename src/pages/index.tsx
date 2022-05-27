import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { convertToRaw, EditorState } from 'draft-js';
import * as React from 'react';
import { useState } from 'react';

import Layout from '@/components/layout/Layout';
import TextEditor, { IFile } from '@/components/TextEditor';

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
          <Container component='main'>
            <CssBaseline />
            <div className='layout flex min-h-screen py-20'>
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextEditor
                      editorState={editorState}
                      setEditorState={setEditorState}
                      attachedFiles={attachedFiles}
                      setAttachedFile={setAttachedFile}
                    />
                  </Grid>
                </Grid>
                <Button
                    style={{marginTop: '25px'}}
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                >
                  Sign Up
                </Button>
              </form>
            </div>
          </Container>
        </section>
      </main>
    </Layout>
  );
}
