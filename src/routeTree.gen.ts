/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as SitemapDotxmlRouteImport } from './routes/sitemap[.]xml'
import { Route as CategoriaSlugRouteImport } from './routes/categoria.$slug'
import { Route as HerramientasIndexRouteImport } from './routes/herramientas.index'
import { Route as HerramientasSlugRouteImport } from './routes/herramientas.$slug'
import { Route as FinanzasRouteImport } from './routes/finanzas'
import { Route as FinanzasSlugRouteImport } from './routes/finanzas.$slug'

const IndexRoute=IndexRouteImport.update({id:'/',path:'/',getParentRoute:()=>rootRouteImport} as any)
const SitemapDotxmlRoute=SitemapDotxmlRouteImport.update({id:'/sitemap.xml',path:'/sitemap.xml',getParentRoute:()=>rootRouteImport} as any)
const CategoriaSlugRoute=CategoriaSlugRouteImport.update({id:'/categoria/$slug',path:'/categoria/$slug',getParentRoute:()=>rootRouteImport} as any)
const HerramientasIndexRoute=HerramientasIndexRouteImport.update({id:'/herramientas/',path:'/herramientas/',getParentRoute:()=>rootRouteImport} as any)
const HerramientasSlugRoute=HerramientasSlugRouteImport.update({id:'/herramientas/$slug',path:'/herramientas/$slug',getParentRoute:()=>rootRouteImport} as any)
const FinanzasRoute=FinanzasRouteImport.update({id:'/finanzas',path:'/finanzas',getParentRoute:()=>rootRouteImport} as any)
const FinanzasSlugRoute=FinanzasSlugRouteImport.update({id:'/finanzas/$slug',path:'/finanzas/$slug',getParentRoute:()=>rootRouteImport} as any)

const rootRouteChildren={IndexRoute,SitemapDotxmlRoute,CategoriaSlugRoute,HerramientasSlugRoute,HerramientasIndexRoute,FinanzasRoute,FinanzasSlugRoute}
export const routeTree=rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<any>()
import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start'{interface Register{ssr:true;router:Awaited<ReturnType<typeof getRouter>>;config:Awaited<ReturnType<typeof startInstance.getOptions>>}}