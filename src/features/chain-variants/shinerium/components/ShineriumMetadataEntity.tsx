// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import * as EntityBase from 'src/shared/entities/components';
import { distributeEntityProps } from 'src/shared/entities/utils';
import { route } from 'src/shared/router/routes';

export interface EntityProps extends EntityBase.EntityBaseProps {
  readonly hash: string;
}

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'hash'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/metadata/[hash]', query: { hash: props.hash } });

  return (
    <EntityBase.Link { ...props } href={ props.href ?? defaultHref }>
      { props.children }
    </EntityBase.Link>
  );
});

const Icon = (props: EntityBase.IconBaseProps) => {
  return <EntityBase.Icon { ...props } name={ 'name' in props ? props.name : 'docs' }/>;
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'hash'>;

const Content = chakra((props: ContentProps) => {
  const { hash, ...rest } = props;
  return <EntityBase.Content { ...rest } text={ hash }/>;
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'hash'>;

const Copy = (props: CopyProps) => {
  const { hash, ...rest } = props;
  return <EntityBase.Copy { ...rest } text={ hash }/>;
};

const ShineriumMetadataEntity = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);
  const content = <Content { ...partsProps.content }/>;

  return (
    <EntityBase.Container { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      { props.noLink ? content : <Link { ...partsProps.link }>{ content }</Link> }
      <Copy { ...partsProps.copy }/>
    </EntityBase.Container>
  );
};

export default React.memo(chakra(ShineriumMetadataEntity));
