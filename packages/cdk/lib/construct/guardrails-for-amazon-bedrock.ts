import { Construct } from 'constructs';
import { aws_bedrock as bedrock } from 'aws-cdk-lib';

export class GuardrailsForAmazonBedrock extends Construct{
  public readonly guardrailIdentifier: string;
  public readonly guardrailVersion: string;

  constructor(scope: Construct, id: string){
    super(scope, id);
    const cfnGuardrail = new bedrock.CfnGuardrail(this,`contentGuardrail`,{
      blockedInputMessaging: '禁止 PII の入力を検出しました。管理者に問い合わせください。',
      blockedOutputsMessaging: '禁止 PII の出力を検出しました。管理者に問い合わせください。',
      name : `PIIGuardrail${id}`,
      sensitiveInformationPolicyConfig: {
        // 日本の名前、免許番号は機能しないので設定しない
        // CA_*, US_*, UK_* はそれぞれの国固有のものなので設定しない
        piiEntitiesConfig: [
          {'action': 'BLOCK', 'type': 'AGE'},
          {'action': 'BLOCK', 'type': 'AWS_ACCESS_KEY'},
          {'action': 'BLOCK', 'type': 'AWS_SECRET_KEY'},
          {'action': 'BLOCK', 'type': 'CREDIT_DEBIT_CARD_CVV'},
          {'action': 'BLOCK', 'type': 'CREDIT_DEBIT_CARD_EXPIRY'},
          {'action': 'BLOCK', 'type': 'CREDIT_DEBIT_CARD_NUMBER'},
          {'action': 'BLOCK', 'type': 'EMAIL'},
          {'action': 'BLOCK', 'type': 'INTERNATIONAL_BANK_ACCOUNT_NUMBER'},
          {'action': 'BLOCK', 'type': 'IP_ADDRESS'},
          {'action': 'BLOCK', 'type': 'LICENSE_PLATE'},
          {'action': 'BLOCK', 'type': 'MAC_ADDRESS'},
          {'action': 'BLOCK', 'type': 'PASSWORD'},
          {'action': 'BLOCK', 'type': 'PHONE'},
          {'action': 'BLOCK', 'type': 'PIN'},
          {'action': 'BLOCK', 'type': 'SWIFT_CODE'},
          {'action': 'BLOCK', 'type': 'URL'},
          {'action': 'BLOCK', 'type': 'USERNAME'},
        ],
      },
    })
    const cfnGuardrailVersion = new bedrock.CfnGuardrailVersion(this, `contentGuardrailVersion`, {
      guardrailIdentifier:cfnGuardrail.attrGuardrailId,
      description: `GenU PII Guardrail`,
    })

    this.guardrailIdentifier=cfnGuardrail.attrGuardrailId
    this.guardrailVersion=cfnGuardrailVersion.attrVersion
  }
}