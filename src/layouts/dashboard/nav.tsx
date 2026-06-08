import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import type { NavItem } from '../nav-config-dashboard';
// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  collapsed,
  onToggleCollapse,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        transition: theme.transitions.create(['width'], {
          easing: 'var(--layout-transition-easing)',
          duration: 'var(--layout-transition-duration)',
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} collapsed={collapsed} />

      {onToggleCollapse && (
        <IconButton
          onClick={onToggleCollapse}
          sx={{
            position: 'absolute',
            top: 24,
            right: -12,
            zIndex: 9,
            width: 24,
            height: 24,
            p: 0,
            bgcolor: 'background.paper',
            border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Iconify
            icon={(collapsed ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill') as any}
            width={16}
          />
        </IconButton>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const theme = useTheme();

  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx, collapsed, onToggleCollapse }: NavContentProps) {
  const pathname = usePathname();

  return (
    <>
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1,
          pl: collapsed ? 1.5 : 0,
          transition: theme.transitions.create(['padding-left']),
          justifyContent: 'flex-start',
        })}
      >
        <Logo />
        <Typography
          variant="h6"
          sx={(theme) => ({
            fontWeight: 'fontWeightBold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            transition: theme.transitions.create(['max-width', 'opacity']),
            opacity: collapsed ? 0 : 1,
            maxWidth: collapsed ? 0 : 160,
          })}
        >
          {CONFIG.appName}
        </Typography>
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent sx={{ mx: 0 }}>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              mt: 2,
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box
            component="ul"
            sx={{
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={[
                      (theme) => ({
                        px: collapsed ? 1.5 : 2,
                        py: 1,
                        gap: collapsed ? 0 : 2,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontWeight: 'fontWeightMedium',
                        color: theme.vars.palette.text.secondary,
                        minHeight: 44,
                        justifyContent: 'flex-start',
                        transition: theme.transitions.create(['padding', 'gap', 'background-color', 'color'], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        ...(isActived && {
                          fontWeight: 'fontWeightSemiBold',
                          color: theme.vars.palette.primary.main,
                          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                          '&:hover': {
                            bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                          },
                        }),
                      }),
                    ]}
                  >
                    <Box component="span" sx={{ width: 24, height: 24, flexShrink: 0 }}>
                      {item.icon}
                    </Box>

                    <Box
                      component="span"
                      sx={(theme) => ({
                        flexGrow: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        transition: theme.transitions.create(['max-width', 'opacity', 'margin']),
                        opacity: collapsed ? 0 : 1,
                        maxWidth: collapsed ? 0 : 160,
                        ml: collapsed ? 0 : 0,
                      })}
                    >
                      {item.title}
                    </Box>

                    <Box
                      component="span"
                      sx={(theme) => ({
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        transition: theme.transitions.create(['max-width', 'opacity']),
                        opacity: collapsed ? 0 : 1,
                        maxWidth: collapsed ? 0 : 80,
                      })}
                    >
                      {item.info && item.info}
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          fullWidth={!collapsed}
          variant="outlined"
          color="error"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          startIcon={<Iconify icon={"solar:logout-2-bold" as any} />}
          sx={{
            minWidth: collapsed ? 44 : 'auto',
            height: collapsed ? 44 : 'auto',
            p: collapsed ? 0 : 1,
            '& .MuiButton-startIcon': {
              mx: collapsed ? 0 : 'inherit',
            },
          }}
        >
          <Box
            component="span"
            sx={(theme) => ({
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: theme.transitions.create(['max-width', 'opacity']),
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : 120,
            })}
          >
            Logout
          </Box>
        </Button>
      </Box>
    </>
  );
}
