# synapse-template-fr

Traduction de Matrix Synapse en français.

Tout n'est pas traduit donc n'hésitez pas à proposer vos traductions !

## Installation de la traduction

Créer un répertoire pour le template en français :

```
mkdir /etc/matrix-synapse/templates-fr
```

Télécharger la release désirée au format ZIP (https://github.com/agrimpard/synapse-template-fr/tags) :

```
wget https://github.com/agrimpard/synapse-template-fr/archive/refs/tags/v2024-02-19.zip -P /etc/matrix-synapse/
```

Dézipper l'archive dans le répertoire de Synapse :

```
unzip -j /etc/matrix-synapse/v2024-02-19.zip -d /etc/matrix-synapse/templates-fr/
```

Donner les droits à l'utilisateur Synapse :

```
chown -R matrix-synapse:matrix-synapse /etc/matrix-synapse/templates-fr/
```

Supprimer l'archive qui n'est plus nécessaire :

```
rm /etc/matrix-synapse/v2024-02-19.zip
```

Ajouter dans votre configuration homeserver `nano /etc/matrix-synapse/homeserver.yaml` le paramètre permettant d'indiquer qu'un template est disponible :

```
templates:
  custom_template_directory: /etc/matrix-synapse/templates-fr/
```

Redémarrer Synapse ...

## Sources

Les sources sont disponibles sur le dépôt officiel : https://github.com/element-hq/synapse/tree/develop/synapse/res/templates

Pour télécharger les sources : https://download-directory.github.io/?url=https%3A%2F%2Fgithub.com%2Fmatrix-org%2Fsynapse%2Ftree%2Fmaster%2Fsynapse%2Fres%2Ftemplates