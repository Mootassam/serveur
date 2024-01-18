const fr = {
  app: {
    title: '应用程序',
  },
  auth: {
    userNotFound:
      '抱歉，我们无法识别您的凭据',
    wrongPassword:
      '抱歉，我们无法识别您的凭据',
    weakPassword: '这个密码太弱',
    emailAlreadyInUse: '邮箱已被使用',
    invalidEmail:
      '请提供一个有效的邮箱',
    passwordReset: {
      invalidToken:
      '密码重置链接无效或已过期',
      error: '电子邮件无法识别',
    },
    emailAddressVerificationEmail: {
      invalidToken:
      '电子邮件验证链接无效或已过期。',
      error: `无法识别电子邮件。`,
      signedInAsWrongUser:
      `此电子邮件确认已发送至 {0}，但您已登录为 {1}。`,
    },
    passwordChange: {
      invalidPassword:
        '旧密码无效.',
    },
  },
  user: {
    errors: {
      userAlreadyExists:
        '使用此电子邮件的用户已经存在。',
      userNotFound: '找不到用户。',
      destroyingHimself: '你不能删除自己。',
      revokingOwnPermission:
        '你不能撤销你自己的管理员权限。',
      revokingPlanUser:
        '你不能撤销计划管理员的管理员权限。',
      destroyingPlanUser:
        '你不能删除计划管理器。',
    },
  },
  tenant: {
    exists:
      'Ya hay un espacio de trabajo en esta aplicación.',
    url: {
      exists:
        'Esta URL del espacio de trabajo ya está en uso.',
    },
    invitation: {
      notSameEmail:
        'Esta invitación se envió a {0} pero has iniciado sesión como {1}.',
    },
    planActive:
      'Hay un plan activo para este espacio de trabajo. Por favor, cancele el plan primero.',
    stripeNotConfigured: 'Stripe no está configurado.',
  },
  importer: {
    errors: {
      invalidFileEmpty: 'El archivo esta vacio',
      invalidFileExcel:
        'Solo se permiten archivos de Excel(.xlsx)',
      invalidFileUpload:
        'Archivo inválido. Asegúrese de estar utilizando la última versión de la plantilla.',
      importHashRequired: 'Se requiere hash de importación',
      importHashExistent:
        'Los datos ya han sido importados',
    },
  },
  errors: {
    notFound: {
      message: '未找到信息',
    },
    forbidden: {
      message: '禁止',
    },
    validation: {
      message: '发生错误',
    },
  },
  email: {
    error:
      '电子邮件提供商未配置。',
  },
  preview: {
    error:
    '对不起，在预览模式下不允许执行此操作。',
  },

  entities: {
    category: {
      errors: {
        unique: {},
      },
    },
    subcategories: {
      errors: {
        unique: {},
      },
    },
    chieldCategories: {
      errors: {
        unique: {},
      },
    },
    taxes: {
      errors: {
        unique: {},
      },
    },
    brands: {
      errors: {
        unique: {},
      },
    },
    edit: {
      errors: {
        unique: {},
      },
    },
    campaignItems: {
      errors: {
        unique: {},
      },
    },
    gallery: {
      errors: {
        unique: {},
      },
    },
    product: {
      errors: {
        unique: {},
      },
    },
    shippingservice: {
      errors: {
        unique: {},
      },
    },
    coupons: {
      errors: {
        unique: {},
      },
    },
    transaction: {
      errors: {
        unique: {},
      },
    },
    trackOrder: {
      errors: {
        unique: {},
      },
    },
    order: {
      errors: {
        unique: {},
      },
    },
    state: {
      errors: {
        unique: {},
      },
    },
    attributeOptions: {
      errors: {
        unique: {},
      },
    },
    cart: {
      errors: {
        unique: {},
      },
    },
    paymentsettings: {
      errors: {
        unique: {},
      },
    },
    review: {
      errors: {
        unique: {},
      },
    },
    attributes: {
      errors: {
        unique: {},
      },
    },
  },
};

export default fr;
