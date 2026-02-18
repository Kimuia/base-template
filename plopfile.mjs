export default function (plop) {
  // === Entity Generator ===
  plop.setGenerator('entity', {
    description: 'Create a new entity (data layer)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Entity name (e.g., user, product, order):',
        validate: (value) => (value ? true : 'Entity name is required'),
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/entity/{{dashCase name}}/{{dashCase name}}.schema.ts',
        templateFile: 'plop-templates/entity/schema.hbs',
      },
      {
        type: 'add',
        path: 'src/entity/{{dashCase name}}/{{dashCase name}}.service.ts',
        templateFile: 'plop-templates/entity/service.hbs',
      },
      {
        type: 'add',
        path: 'src/entity/{{dashCase name}}/{{dashCase name}}.constant.ts',
        templateFile: 'plop-templates/entity/constant.hbs',
      },
      {
        type: 'add',
        path: 'src/entity/{{dashCase name}}/index.ts',
        templateFile: 'plop-templates/entity/index.hbs',
      },
    ],
  });

  // === Module Generator ===
  plop.setGenerator('module', {
    description: 'Create a new module (use-case)',
    prompts: [
      {
        type: 'input',
        name: 'entity',
        message: 'Entity name (e.g., user, product):',
        validate: (value) => (value ? true : 'Entity name is required'),
      },
      {
        type: 'input',
        name: 'useCase',
        message: 'Use-case name (e.g., info, list, form):',
        validate: (value) => (value ? true : 'Use-case name is required'),
      },
      {
        type: 'confirm',
        name: 'hasAction',
        message: 'Does this module have write operations (action.ts)?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'hasForm',
        message: 'Generate a Form component with useActionState?',
        default: false,
        when: (data) => data.hasAction,
      },
      {
        type: 'confirm',
        name: 'hasOptimistic',
        message: 'Generate a useOptimistic hook for optimistic UI?',
        default: false,
        when: (data) => data.hasAction,
      },
    ],
    actions: (data) => {
      const actions = [
        {
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/{{dashCase entity}}-{{dashCase useCase}}.loader.ts',
          templateFile: 'plop-templates/module/loader.hbs',
        },
        {
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/{{dashCase entity}}-{{dashCase useCase}}.adapter.ts',
          templateFile: 'plop-templates/module/adapter.hbs',
        },
        {
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/{{dashCase entity}}-{{dashCase useCase}}.ui.ts',
          templateFile: 'plop-templates/module/ui.hbs',
        },
        {
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/components/.gitkeep',
          template: '',
        },
        {
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/index.ts',
          templateFile: 'plop-templates/module/index.hbs',
        },
      ];

      if (data.hasAction) {
        actions.splice(1, 0, {
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/{{dashCase entity}}-{{dashCase useCase}}.action.ts',
          templateFile: 'plop-templates/module/action.hbs',
        });
      }

      if (data.hasForm) {
        actions.push({
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/components/{{pascalCase entity}}{{pascalCase useCase}}Form/{{pascalCase entity}}{{pascalCase useCase}}Form.tsx',
          templateFile: 'plop-templates/module/form-component.hbs',
        });
        actions.push({
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/components/{{pascalCase entity}}{{pascalCase useCase}}Form/index.ts',
          template:
            "export { {{pascalCase entity}}{{pascalCase useCase}}Form } from './{{pascalCase entity}}{{pascalCase useCase}}Form';\n",
        });
      }

      if (data.hasOptimistic) {
        actions.push({
          type: 'add',
          path: 'src/module/{{dashCase entity}}/{{dashCase useCase}}/hooks/use{{pascalCase entity}}{{pascalCase useCase}}Optimistic.ts',
          templateFile: 'plop-templates/module/hook-optimistic.hbs',
        });
      }

      return actions;
    },
  });
}
