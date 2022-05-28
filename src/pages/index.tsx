import Button from '@material-ui/core/Button';
import { Grid, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { EditorState, convertToRaw } from 'draft-js';
import * as React from 'react';
import { useState } from 'react';

import Attachment from '@/components/Attachment';
import Layout from '@/components/layout/Layout';
import RichTextEditor, { IFile } from '@/components/RichTextEditor';

export default function HomePage() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [attachedFiles, setAttachedFile] = useState<IFile[]>([]);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    attachedFiles.forEach((file) => console.log(file.name));
    console.log(convertToRaw(editorState.getCurrentContent()));
  };

  return (
    <Layout>
      <main>
        <section className='bg-white'>
          <Card>
            <div className='layout min-h-screen py-20'>
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={7}>
                    <Grid item>
                      <RichTextEditor
                        editorState={editorState}
                        setEditorState={setEditorState}
                        setAttachedFile={setAttachedFile}
                      />
                    </Grid>
                    <Grid item xs={6} style={{ marginTop: '10px' }}>
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
                  <Grid item xs={12} sm={5}>
                    <Typography component='h1' variant='h5'>
                      {attachedFiles.length === 0
                        ? ''
                        : attachedFiles.length === 1
                        ? 'file'
                        : 'files'}
                    </Typography>
                    <Attachment attachedFiles={attachedFiles} />
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
