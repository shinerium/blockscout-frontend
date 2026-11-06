// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import * as EntityBase from 'src/shared/entities/components';
import { distributeEntityProps } from 'src/shared/entities/utils';

export interface EntityProps extends EntityBase.EntityBaseProps {
  readonly identity: string;
  readonly label: string | null;
}

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'identity'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/validators/[id]', query: { id: props.identity } });

  return (
    <EntityBase.Link { ...props } href={ props.href ?? defaultHref }>
      { props.children }
    </EntityBase.Link>
  );
});

const Icon = (props: EntityBase.IconBaseProps) => {
  return <EntityBase.Icon { ...props } name={ 'name' in props ? props.name : 'key' }/>;
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'identity' | 'label'>;

const Content = chakra((props: ContentProps) => {
  const { identity, label, ...rest } = props;
  return <EntityBase.Content { ...rest } text={ label ?? identity }/>;
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'identity'>;

const Copy = (props: CopyProps) => {
  const { identity, ...rest } = props;
  return <EntityBase.Copy { ...rest } text={ identity }/>;
};

const ShineriumValidatorEntity = (props: EntityProps) => {
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

export default React.memo(chakra(ShineriumValidatorEntity));
