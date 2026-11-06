// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import * as EntityBase from 'src/shared/entities/components';
import { distributeEntityProps } from 'src/shared/entities/utils';

export interface EntityProps extends EntityBase.EntityBaseProps {
  readonly number: number;
}

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'number'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/epochs/[number]', query: { number: String(props.number) } });

  return (
    <EntityBase.Link { ...props } href={ props.href ?? defaultHref }>
      { props.children }
    </EntityBase.Link>
  );
});

const Icon = (props: EntityBase.IconBaseProps) => {
  return <EntityBase.Icon { ...props } name={ 'name' in props ? props.name : 'hourglass' }/>;
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'number'>;

const Content = chakra((props: ContentProps) => {
  const { number, ...rest } = props;
  return <EntityBase.Content { ...rest } text={ String(number) }/>;
});

const ShineriumEpochEntity = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);
  const content = <Content { ...partsProps.content }/>;

  return (
    <EntityBase.Container { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      { props.noLink ? content : <Link { ...partsProps.link }>{ content }</Link> }
    </EntityBase.Container>
  );
};

export default React.memo(chakra(ShineriumEpochEntity));
