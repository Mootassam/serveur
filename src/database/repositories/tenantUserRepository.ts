import MongooseRepository from './mongooseRepository';
import AuditLogRepository from './auditLogRepository';
import User from '../models/user';
import Roles from '../../security/roles';
import crypto from 'crypto';
import { IRepositoryOptions } from './IRepositoryOptions';

export default class TenantUserRepository {
  static async findByInvitationToken(
    invitationToken,
    options: IRepositoryOptions,
  ) {
    let user =
      await MongooseRepository.wrapWithSessionIfExists(
        User(options.database)
          .findOne({
            tenants: { $elemMatch: { invitationToken } },
          })
          .populate('tenants.tenant'),
        options,
      );

    if (!user) {
      return null;
    }

    user = user.toObject ? user.toObject() : user;

    const tenantUser = user.tenants.find((userTenant) => {
      return userTenant.invitationToken === invitationToken;
    });

    return {
      ...tenantUser,
      user,
    };
  }

  static async create(
    tenant,
    user,
    roles,
    options: IRepositoryOptions,
  ) {
    roles = roles || [];
    const status = selectStatus('active', roles);

    await User(options.database).updateMany(
      { _id: user.id },
      {
        $push: {
          tenants: {
            tenant: tenant.id,
            status,
            roles,
          },
        },
      },
      options,
    );

    await AuditLogRepository.log(
      {
        entityName: 'user',
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: {
          email: user.email,
          status,
          roles,
        },
      },
      options,
    );
  }

  static async destroy(
    tenantId,
    id,
    options: IRepositoryOptions,
  ) {
    const user =
      await MongooseRepository.wrapWithSessionIfExists(
        User(options.database).findById(id),
        options,
      );

    await User(options.database).updateOne(
      { _id: id },
      {
        $pull: {
          tenants: { tenant: tenantId },
        },
      },
      options,
    );

    await AuditLogRepository.log(
      {
        entityName: 'user',
        entityId: user.id,
        action: AuditLogRepository.DELETE,
        values: {
          email: user.email,
        },
      },
      options,
    );
  }

  static async updateRoles(tenantId, id, roles, options, status) {
    const user = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .findById(id)
        .populate('tenants.tenant'),
      options,
    );

    let tenantUser = user.tenants.find((userTenant) => {
      return userTenant.tenant.id === tenantId;
    });

    let isCreation = false;

    if (!tenantUser) {
      isCreation = true;
      tenantUser = {
        tenant: tenantId,
        // status: selectStatus('invited', []),
        status: status,
        invitationToken: crypto
          .randomBytes(20)
          .toString('hex'),
        roles: [],
      };

      await User(options.database).updateOne(
        { _id: id },
        {
          $push: {
            tenants: tenantUser,
          },
        },
        options,
      );
    }
    let { roles: existingRoles } = tenantUser;

    let newRoles = [] as Array<string>;

    if (options.addRoles) {
      newRoles = [...new Set([...existingRoles, ...roles])];
    } else if (options.removeOnlyInformedRoles) {
      newRoles = existingRoles.filter(
        (existingRole) => !roles.includes(existingRole),
      );
    } else {
      newRoles = roles || [];
    }

    tenantUser.roles = newRoles;
    tenantUser.status = status,
      // tenantUser.status = selectStatus(
      //   tenantUser.status,
      //   newRoles,
      // );

      await User(options.database).updateOne(
        { _id: id, 'tenants.tenant': tenantId },
        {
          $set: {
            'tenants.$.roles': newRoles,
            'tenants.$.status': tenantUser.status,
          },
        },
        options,
      );

    await AuditLogRepository.log(
      {
        entityName: 'user',
        entityId: user.id,
        action: isCreation
          ? AuditLogRepository.CREATE
          : AuditLogRepository.UPDATE,
        values: {
          email: user.email,
          status: tenantUser.status,
          roles: newRoles,
        },
      },
      options,
    );

    // if (status === 'active') {
    //   const SibApiV3Sdk = require('sib-api-v3-sdk');
    //   let defaultClient = SibApiV3Sdk.ApiClient.instance;

    //   let apiKey = defaultClient.authentications['api-key'];
    //   apiKey.apiKey = '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';

    //   let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    //   let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    //   sendSmtpEmail.subject = "{{params.subject}}";
    //   sendSmtpEmail.htmlContent = `<html>
    //   <h1>Mr/Mrs: {{params.name}}</h1>
    //   <p>Your account is now active</p>
    //   <a href='http://www.liguedigitale.tadeco-group.tn/auth/signin?email={{params.email}}'><center class='default-button'><p>Visit our app</p></center></a>
    //   </html>`;
    //   sendSmtpEmail.sender = { "name": "No Reply", "email": "ligue-digitale@tadeco-group.tn" };
    //   // sendSmtpEmail.templateId = 2;
    //   sendSmtpEmail.to = [{ "email": user.email, "name": user.fullName }];
    //   sendSmtpEmail.replyTo = { "email": "salma.talbi@tadeco-group.tn", "name": "Tadeco IT" };
    //   sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    //   sendSmtpEmail.params = { "parameter": "My param value", "subject": "Ligue Digitale", "name": user.fullName, "email": user.email };

    //   apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    //     console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    //   }, function (error) {
    //     console.error(error);
    //   });
    // }

    // if ((status === 'invited') && (roles.includes('membre'))) {
    //   const SibApiV3Sdk = require('sib-api-v3-sdk');
    //   let defaultClient = SibApiV3Sdk.ApiClient.instance;

    //   let apiKey = defaultClient.authentications['api-key'];
    //   apiKey.apiKey = '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';

    //   let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    //   let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    //   sendSmtpEmail.subject = "{{params.subject}}";
    //   sendSmtpEmail.htmlContent = `<html>
    //   <h1>Mr/Mrs: {{params.name}}</h1>
    //   <h3>You are invited to {{params.subject}}</h3>
    //   <h4>Your email: {{params.email}}</h4>
    //   <a href='http://www.liguedigitale.tadeco-group.tn/auth/signup?invitationToken={{params.invitationToken}}&email={{params.email}}'><center class='default-button'><p>Register Now</p></center></a>
    //   </html>`;
    //   sendSmtpEmail.sender = { "name": "No Reply", "email": "ligue-digitale@tadeco-group.tn" };
    //   sendSmtpEmail.to = [{ "email": user.email, "name": user.fullName }];
    //   sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    //   sendSmtpEmail.params = { "parameter": "My param value", "subject": "Ligue Digitale", "name": user.fullName, "email": user.email, "invitationToken": tenantUser.invitationToken };

    //   apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    //     console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    //   }, function (error) {
    //     console.error(error);
    //   });
    // }

    return tenantUser;
  }


  static async acceptInvitation(
    invitationToken,
    options: IRepositoryOptions,
  ) {
    const currentUser =
      MongooseRepository.getCurrentUser(options);

    // This tenant user includes the User data
    let invitationTenantUser =
      await this.findByInvitationToken(
        invitationToken,
        options,
      );

    let existingTenantUser = currentUser.tenants.find(
      (userTenant) =>
        String(userTenant.tenant.id) ===
        String(invitationTenantUser.tenant.id),
    );

    // destroys old invite just for sure
    await this.destroy(
      invitationTenantUser.tenant.id,
      invitationTenantUser.user.id,
      options,
    );

    const tenantUser = {
      tenant: invitationTenantUser.tenant.id,
      invitationToken: null,
      status: selectStatus(
        'active',
        invitationTenantUser.roles,
      ),
      roles: invitationTenantUser.roles,
    };

    // In case the user is already a member, should merge the roles
    if (existingTenantUser) {
      // Merges the roles from the invitation and the current tenant user
      tenantUser.roles = [
        ...new Set([
          ...existingTenantUser.roles,
          ...invitationTenantUser.roles,
        ]),
      ];
    }

    const isSameEmailFromInvitation =
      invitationTenantUser.user.id === currentUser.id;

    // Auto-verifies email if the invitation token matches the same email
    const emailVerified =
      currentUser.emailVerified ||
      isSameEmailFromInvitation;

    await User(options.database).updateOne(
      { _id: currentUser.id },
      {
        emailVerified,
        $push: {
          tenants: tenantUser,
        },
      },
      options,
    );

    await AuditLogRepository.log(
      {
        entityName: 'user',
        entityId: currentUser.id,
        action: AuditLogRepository.UPDATE,
        values: {
          email: currentUser.email,
          roles: tenantUser.roles,
          status: selectStatus('active', tenantUser.roles),
        },
      },
      options,
    );
  }
}

function selectStatus(oldStatus, newRoles) {
  newRoles = newRoles || [];

  if (oldStatus === 'invited') {
    return oldStatus;
  }

  if (!newRoles.length) {
    return 'empty-permissions';
  }

  return 'active';
}
