import {
  alpha,
  Box,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { CSSProperties, Fragment } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

import fileTypeIcons from '@/components/Attachment/img/file-type-icons.png';

import { formatBytes } from '@/utils/bytes';

export const supportedFileIcons = [
  'pdf',
  'jpg',
  'png',
  'ppt',
  'doc',
  'zip',
  'exe',
  'wav',
  'mpg',
  'mp4',
  'mov',
  'html',
  'xlsx',
  'svg',
  'docx',
  'jar',
  'json',
  'csv',
  'py',
  'xml',
  'mp3',
  'css',
  'js',
  'txt',
  'reg',
  'psd',
  'ink',
  'inf',
];
const iconGroups: Record<string, string[]> = {
  jpg: ['jpeg'],
  zip: ['rar', '7z', 'gz', 'tar'],
  jar: ['war', 'jad'],
  xlsx: ['xltx'],
  ink: ['lnk'],
  inf: ['nfo'],
};

export const fileIconAliases = Object.keys(iconGroups).reduce(
  (accumulator, key) => {
    iconGroups[key].forEach((alias) => (accumulator[alias] = key));
    return accumulator;
  },
  {} as Record<string, string>
);

supportedFileIcons.push(...Object.keys(fileIconAliases));

const supportedSmallFileIconStyles = supportedFileIcons.reduce(
  (accumulator, fileExtension, index) => {
    const columnIndex = index % 12;
    const rowIndex = Math.floor(index / 12);
    accumulator[fileExtension] = {
      backgroundPosition: `${-columnIndex * 68}px ${-rowIndex * 90}px`,
    };
    return accumulator;
  },
  {} as Record<string, CSSProperties>
);

interface IFile {
  id: string;
  type: string;
  value?: string;
  name: string;
  size: number;
}
export default function Attachment({
  attachedFiles,
  setAttachedFile,
}: {
  attachedFiles: IFile[];
  setAttachedFile: any;
}) {
  const theme = useTheme();
  const onDeleteFile = (id: string) => {
    setAttachedFile(() => attachedFiles.filter((file) => file.id !== id));
  };
  return (
    <>
      {attachedFiles.length > 0 && (
        <>
          <Grid container>
            {attachedFiles.map(({ name, size, id }, index) => {
              const fileExtension = (() => {
                const fileExtensionMatch = /\.(\w+)$/g.exec(name);
                if (
                  fileExtensionMatch &&
                  supportedFileIcons.includes(
                    fileExtensionMatch[1].toLowerCase()
                  )
                ) {
                  const fileExtension = fileExtensionMatch[1].toLowerCase();
                  return fileIconAliases[fileExtension] || fileExtension;
                }
                return false;
              })();
              return (
                <Grid
                  item
                  xs={12}
                  sm={3.8}
                  key={index}
                  style={{
                    backgroundColor: 'lightgray',
                    marginTop: '3px',
                    border: '2px solid #ddd',
                    marginLeft: '3px',
                    borderRadius: '2px',
                  }}
                >
                  <Fragment>
                    <ListItem
                      sx={{
                        pl: 0,
                        pr: 1,
                        py: 0.5,
                        '&:hover': {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                        },
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 40 }}>
                        {fileExtension && (
                          <Box
                            sx={{
                              width: 30,
                              height: 40,
                              '&:after': {
                                content: '""',
                                display: `block`,
                                width: 68,
                                height: 90,
                                position: `absolute`,
                                top: 14,
                                left: 7,
                                backgroundImage: `url('${fileTypeIcons.src}')`,
                                backgroundSize: 816,
                                backgroundRepeat: `no-repeat`,
                                transformOrigin: `top left`,
                                transform: `scale(0.36)`,
                                ...supportedSmallFileIconStyles[fileExtension],
                              },
                            }}
                          />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={name}
                        secondary={formatBytes(size)}
                        secondaryTypographyProps={{
                          sx: {
                            fontSize: 12,
                          },
                        }}
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          wordBreak: 'break-all',
                        }}
                      />
                      <CancelIcon
                        color='action'
                        cursor='pointer'
                        onClick={() => onDeleteFile(id)}
                      />
                    </ListItem>
                  </Fragment>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </>
  );
}
